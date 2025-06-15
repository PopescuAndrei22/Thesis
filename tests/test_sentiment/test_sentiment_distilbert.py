from nlp.sentiment import sentiment_distilbert

def test_distilbert_positive():
    reviews = ["I am so happy with this product!"]
    result = sentiment_distilbert(reviews)
    assert "joy" in result
    assert reviews[0] in result["joy"]

def test_distilbert_negative():
    reviews = ["I feel really sad and disappointed."]
    result = sentiment_distilbert(reviews)
    assert "sadness" in result
    assert reviews[0] in result["sadness"]

def test_distilbert_anger():
    reviews = ["This made me really angry."]
    result = sentiment_distilbert(reviews)
    assert "anger" in result
    assert reviews[0] in result["anger"]

def test_distilbert_multiple_reviews():
    reviews = [
        "I love it!",
        "I'm scared.",
        "This is terrible.",
        "Not bad at all!"
    ]
    result = sentiment_distilbert(reviews)
    assert isinstance(result, dict)
    assert any("joy" in result for review in reviews)