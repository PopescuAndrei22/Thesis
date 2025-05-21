from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from typing import List

class TopicModeler:
    def __init__(self, num_topics: int = 3, max_features: int = 1000, n_words: int = 5):
        self.num_topics = num_topics
        self.n_words = n_words
        self.vectorizer = CountVectorizer(max_features=max_features, stop_words='english')
        self.lda = LatentDirichletAllocation(n_components=num_topics, random_state=42)

    def fit(self, documents: List[str]) -> None:
        X = self.vectorizer.fit_transform(documents)
        self.lda.fit(X)

    def get_topics(self) -> List[List[str]]:
        topics = []
        for topic in self.lda.components_:
            words = [self.vectorizer.get_feature_names_out()[i] for i in topic.argsort()[-self.n_words:]]
            topics.append(words)

        return topics


def extract_topics(documents: List[str], num_topics: int = 3, n_words: int = 5) -> List[List[str]]:
    model = TopicModeler(num_topics=num_topics, n_words=n_words)
    model.fit(documents)
    return model.get_topics()