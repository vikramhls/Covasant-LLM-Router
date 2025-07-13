from fastapi import FastAPI, Request
from model.classifier import classify_prompt

app = FastAPI()

@app.post("/classify")
async def classify(request: Request):
    data = await request.json()
    prompt = data.get("prompt")

    if not prompt:
        return {"error": "No prompt provided."}

    label, model, confidence = classify_prompt(prompt)
    return {
        "type": label,
        "model": model,
        "confidence": round(confidence, 4)
    }
