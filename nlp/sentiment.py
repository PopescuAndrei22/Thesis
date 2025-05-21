from textblob import TextBlob
from transformers import pipeline

goemotions_pipeline = pipeline(
    "text-classification",
    model="joeddav/distilbert-base-uncased-go-emotions-student",
    top_k=1,
    truncation=True
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

def sentiment_goemotions(reviews: list[str]) -> dict[str, list[str]]:
    result = {}

    for review in reviews:
        emotion = goemotions_pipeline(review)[0][0]["label"]
        if emotion not in result:
            result[emotion] = []
        result[emotion].append(review)

    return result