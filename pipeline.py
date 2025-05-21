from nlp.sentiment import sentiment_textblob as sentiment_simple
from nlp.sentiment import sentiment_goemotions as sentiment_complex
from nlp.topic_modeling import extract_topics
from utils.file_reader import read_file
from nlp.llm import TopicSummarizer
import ast

def format_message(summary_str):
    if isinstance(summary_str, str):
        try:
            return ast.literal_eval(summary_str)
        except (ValueError, SyntaxError) as e:
            print(f"Error evaluating string: {e}")
            return None
    else:
        return summary_str

def process_reviews(filename: str, emotion_type: str):

    result = {}

    file_location = "data/" + filename
    reviews = read_file(file_location)

    if emotion_type == 'complex':
        sentiments = sentiment_complex(reviews)
    else:
        sentiments = sentiment_simple(reviews)

    for emotion, emotion_reviews in sentiments.items():
        lda_topics = extract_topics(emotion_reviews,num_topics=5,n_words=12)

        llm_summary_object = TopicSummarizer()
        llm_sumary = llm_summary_object.generate_summary(lda_topics,emotion)
        llm_sumary = llm_sumary.replace('\n', ' ').strip()
        llm_sumary = format_message(llm_sumary)

        result[emotion] = {
            "summary": llm_sumary,
            "review_count": len(emotion_reviews)
        }
    
    return result