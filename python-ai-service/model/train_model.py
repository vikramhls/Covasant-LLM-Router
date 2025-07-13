import torch
import joblib
import numpy as np
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
import os

# Load SVM model and Label Encoder
svm_model = joblib.load(os.path.join("model", "svm_model.pkl"))
label_encoder = joblib.load(os.path.join("model", "label_encoder.pkl"))

# Load MiniLM model
model_name = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)
model.eval()

# Get sentence embedding using mean pooling
def get_embedding(text: str):
    with torch.no_grad():
        encoded = tokenizer(
            text, return_tensors="pt", truncation=True, padding=True, max_length=128
        )
        last_hidden = model(**encoded).last_hidden_state
        attention_mask = encoded["attention_mask"].unsqueeze(-1).expand(last_hidden.size())
        summed = torch.sum(last_hidden * attention_mask, 1)
        summed_mask = torch.clamp(attention_mask.sum(1), min=1e-9)
        mean_pooled = summed / summed_mask
        return mean_pooled.squeeze().numpy().reshape(1, -1)  # For sklearn

# Classify prompt using SVM and map to appropriate model
def classify_prompt(prompt: str):
    emb = get_embedding(prompt)
    pred_probs = svm_model.decision_function(emb)

    if len(pred_probs.shape) == 1:  # Binary
        pred_idx = int(pred_probs > 0)
        confidence = float(abs(pred_probs[0]))
    else:  # Multiclass
        pred_idx = np.argmax(pred_probs)
        confidence = float(pred_probs[0][pred_idx])

    raw_label = label_encoder.inverse_transform([pred_idx])[0]
    normalized_label = "Code" if raw_label.lower().startswith("code") else raw_label

    label_to_model = {
        "Code": "deepseek-r1",
        "chat": "mistral",
        "Chat_casual": "mistral",
        "Chat_emotional_support": "mistral",
        "Chat_advice": "mistral",
        "Chat_story": "mistral",
        "gk": "gemma3:12b",
        "GK_current_affairs": "gemma3:12b",
        "GK_history": "gemma3:12b",
        "GK_science": "gemma3:12b",
        "GK_geography": "gemma3:12b",
        "GK_politics": "gemma3:12b",
        "GK_sports": "gemma3:12b",
        "GK_tech": "gemma3:12b",
        "GK_literature": "gemma3:12b",
        "GK_economy": "gemma3:12b",
        "GK_environment": "gemma3:12b",
        "Math": "mistral",
        "Translation": "gemma3:12b",
        "Summarization": "gemma3:12b",
        "Classification": "mistral",
        "Code Explanation / Debug": "deepseek-r1",
        "Miscellaneous / Unknown": "gemma3:12b"
    }

    model_name = label_to_model.get(normalized_label, "unknown")
    return normalized_label, model_name, confidence
