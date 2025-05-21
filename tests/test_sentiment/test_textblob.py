from nlp.sentiment import sentiment_textblob

def test_positive_text():
    reviews = ["I absolutely love it!"]
    result = sentiment_textblob(reviews)
    assert result["positive"] == reviews

def test_negative_text():
    reviews = ["This is awful."]
    result = sentiment_textblob(reviews)
    assert result["negative"] == reviews

def test_neutral_text():
    reviews = ["He went to the shop."]
    result = sentiment_textblob(reviews)
    assert result["neutral"] == reviews