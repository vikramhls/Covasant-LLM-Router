from fastapi import FastAPI, Request
from model.classifier import classify_prompt

app = FastAPI()

@app.post("/classify")
async def classify(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    label, model = classify_prompt(prompt)
    return {"type": label, "model": model}
