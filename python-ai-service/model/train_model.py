import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Load dataset from CSV
df = pd.read_csv("dataset/prompt_20000.csv")

# Prepare features and labels
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["prompt"])
y = df["label"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model and vectorizer
joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("✅ Model trained and saved from CSV!")
