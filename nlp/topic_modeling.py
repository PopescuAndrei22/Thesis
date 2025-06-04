from typing import List, Dict
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np

class TopicModeler:
    def __init__(self, num_topics: int = 3, max_features: int = 1000, n_words: int = 5):
        self.num_topics = num_topics
        self.n_words = n_words
        self.vectorizer = CountVectorizer(max_features=max_features, stop_words='english')
        self.lda = None

    def fit_vectorizer(self, all_documents: List[str]):
        self.vectorizer.fit(all_documents)

    def fit_lda(self, documents: List[str]):
        X = self.vectorizer.transform(documents)
        self.lda = LatentDirichletAllocation(n_components=self.num_topics, random_state=42)
        self.lda.fit(X)

    def get_topics(self) -> List[Dict[str, float]]:
        topics = []
        feature_names = self.vectorizer.get_feature_names_out()

        for topic_weights in self.lda.components_:
            indices = topic_weights.argsort()[-self.n_words:]
            words = [feature_names[i] for i in indices]
            weights = topic_weights[indices]
            percentages = weights / weights.sum() * 100
            topic = {word: round(float(percent), 2) for word, percent in zip(words, percentages)}
            topics.append(topic)

        return topics

def extract_topics(model: TopicModeler, documents: List[str]) -> List[Dict[str, float]]:
    model.fit_lda(documents)
    return model.get_topics()
