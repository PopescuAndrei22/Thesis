from nlp.sentiment import sentiment_goemotions

def test_joy_label():
    reviews = ["I am feeling fantastic!"]
    result = sentiment_goemotions(reviews)
    assert "optimism" in result
    assert reviews[0] in result["optimism"]

def test_sadness_label():
    reviews = ["I feel really down and gloomy."]
    result = sentiment_goemotions(reviews)
    assert "sadness" in result
    assert reviews[0] in result["sadness"]

def test_confusion_label():
    reviews = ["I'm not sure what's going on."]
    result = sentiment_goemotions(reviews)
    assert "confusion" in result
    assert reviews[0] in result["confusion"]