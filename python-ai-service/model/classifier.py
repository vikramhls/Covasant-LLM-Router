import joblib
import os

model_path = os.path.join("model", "model.pkl")
vec_path = os.path.join("model", "vectorizer.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vec_path)

def classify_prompt(prompt: str):
    X = vectorizer.transform([prompt])
    prediction = model.predict(X)[0]

    # Optional: Map label to model name
    label_to_model = {
        "code": "deepseek-r1",
        "gk": "gemma3:12b",
        
        "chat": "mistral"
    }

    return prediction, label_to_model[prediction]
