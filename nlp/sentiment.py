from textblob import TextBlob
from transformers import pipeline
import torch
from datasets import Dataset

emotion_pipeline = pipeline(
    "text-classification",
    model="bhadresh-savani/distilbert-base-uncased-emotion",
    top_k=1,
    truncation=True,
    batch_size=64,
    device=0
)

def sentiment_textblob(reviews: list[str]) -> dict[str, list[str]]:
    result = {"positive": [], "negative": [], "neutral": []}

    for review in reviews:
        polarity = TextBlob(review).sentiment.polarity
        if polarity > 0.1:
            result["positive"].append(review)
        elif polarity < -0.1:
            result["negative"].append(review)
        else:
            result["neutral"].append(review)

    return result


def sentiment_distilbert(reviews: list[str]) -> dict[str, list[str]]:
    dataset = Dataset.from_dict({"text": reviews})

    def classify(batch):
        outputs = emotion_pipeline(batch["text"])
        return {"label": [o[0]["label"] for o in outputs]}

    results = dataset.map(classify, batched=True, batch_size=64)

    grouped = {}
    for text, label in zip(results["text"], results["label"]):
        grouped.setdefault(label, []).append(text)

    return grouped