import pytest
from nlp.topic_modeling import TopicModeler, extract_topics

DOCUMENTS = [
    "The movie was great and the acting was superb.",
    "I love watching movies with great direction.",
    "The plot was boring and predictable.",
    "Fantastic visuals but poor character development.",
    "Amazing soundtrack and brilliant performances.",
]

def test_fit_vectorizer():
    model = TopicModeler()
    model.fit_vectorizer(DOCUMENTS)
    vocab = model.vectorizer.get_feature_names_out()
    assert len(vocab) > 0
    assert "movie" in vocab or "great" in vocab

def test_fit_lda_and_get_topics():
    model = TopicModeler(num_topics=2, n_words=3)
    model.fit_vectorizer(DOCUMENTS)
    model.fit_lda(DOCUMENTS)
    topics = model.get_topics()
    assert isinstance(topics, list)
    assert len(topics) == 2
    for topic in topics:
        assert isinstance(topic, dict)
        assert len(topic) == 3
        for word, percent in topic.items():
            assert isinstance(word, str)
            assert isinstance(percent, float)

def test_extract_topics_function():
    model = TopicModeler(num_topics=2, n_words=2)
    model.fit_vectorizer(DOCUMENTS)
    topics = extract_topics(model, DOCUMENTS)
    assert len(topics) == 2
    for topic in topics:
        assert len(topic) == 2
