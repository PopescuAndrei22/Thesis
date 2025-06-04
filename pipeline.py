from nlp.sentiment import sentiment_textblob as sentiment_simple
from nlp.sentiment import sentiment_fast_emotion as sentiment_complex
from nlp.topic_modeling import TopicModeler, extract_topics
from utils.file_reader import read_file
from utils.text_cleaner import clean_text
from nlp.llm import TopicSummarizer
import ast

def process_reviews(filename: str, emotion_type: str):

    result = {}

    file_location = "data/" + filename
    raw_reviews = read_file(file_location)
    print("raw reviews")

    reviews = [clean_text(review) for review in raw_reviews]
    print("clean reviews")

    if emotion_type == 'complex':
        sentiments = sentiment_complex(reviews)
    else:
        sentiments = sentiment_simple(reviews)
        
    print("emotion calculated")

    model = TopicModeler(num_topics=4, max_features=400, n_words=9)
    model.fit_vectorizer(reviews)

    emotion_topics = {}
    for emotion, emotion_reviews in sentiments.items():
        lda_topics = extract_topics(model,emotion_reviews)
        emotion_topics[emotion] = lda_topics

        result[emotion] = {
            "review_count": len(emotion_reviews),
            "topics": lda_topics
        }

    print("lda applied")

    llm_summary_object = TopicSummarizer()
    llm_sumary = llm_summary_object.generate_summary(emotion_topics)

    for emotion, summary in llm_sumary.items():
        result[emotion]["summary"] = summary
    
    return result

# process_reviews("amazon_review.csv", "simple")