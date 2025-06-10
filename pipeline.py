from nlp.sentiment import sentiment_textblob as sentiment_simple
from nlp.sentiment import sentiment_distilbert as sentiment_complex
from nlp.topic_modeling import TopicModeler, extract_topics
from utils.file_reader import read_file
from utils.text_cleaner import clean_text
from nlp.llm import TopicSummarizer
import ast
import logging
from utils.log_config import setup_logger
import os

logger = setup_logger(os.path.basename(__file__))

def process_reviews(filename: str, emotion_type: str, column: str):

    result = {}

    file_location = "data/" + filename
    raw_reviews = read_file(file_location, column)
    logger.info(f"Reading {filename} reviews")

    reviews = [clean_text(review) for review in raw_reviews]
    logger.info(f"Cleaning {filename} reviews")

    logger.info(f"The selected type of emotion is {emotion_type}")
    if emotion_type == 'complex':
        sentiments = sentiment_complex(reviews)
    else:
        sentiments = sentiment_simple(reviews)
    logger.info(f"The reviews of the file {filename} have been successfully categorized by emotion")

    model = TopicModeler(num_topics=4, max_features=400, n_words=9)
    model.fit_vectorizer(reviews)
    logger.info("The LDA has been initialized")

    emotion_topics = {}
    for emotion, emotion_reviews in sentiments.items():
        lda_topics = extract_topics(model,emotion_reviews)
        emotion_topics[emotion] = lda_topics

        result[emotion] = {
            "review_count": len(emotion_reviews),
            "topics": lda_topics
        }
    logger.info("The LDA topics have been successfully extracted for each emotion")

    logger.info("Initializing the LLM")
    llm_summary_object = TopicSummarizer()
    llm_sumary = llm_summary_object.generate_summary(emotion_topics)

    for emotion, summary in llm_sumary.items():
        result[emotion]["summary"] = summary
    logger.info(f"The summaries have been completed. The results for the file {filename} are ready to be sent to the frontend.")
    
    return result