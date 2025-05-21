import os
import logging
from typing import Optional
from dotenv import load_dotenv
from groq import Groq
from utils.log_config import setup_logger
import json

load_dotenv()

logger = setup_logger(os.path.basename(__file__))

class ConfigError(Exception):
    pass

class TopicSummarizer:

    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            logger.critical("GROQ_API_KEY is not set in the environment")
            raise ConfigError("GROQ_API_KEY is missing. Please set it in your environment variables or pass it directly.")

        self.client = Groq(api_key=self.api_key)
        logger.info("Groq client initialized successfully.")

    def generate_summary(self, topics, emotion) -> list:

        prompt = (
            f"In the context of reviews of an entity, you are given an emotion and a list of topics generated with the LDA algorithm.\n"
            f"Emotion: {emotion}\n"
            f"Topics and keywords for each topic:\n"
            + "\n".join(
                f"{i+1}. {', '.join(words)}" for i, words in enumerate(topics)
            )
            + "\n\nFor each topic above, generate:\n"
            "- A short topic name (1-3 words)\n"
            "- A brief description about the entity, based on that topic and the given emotion of the reviews.\n"
            "Format the response as a Python list of dictionaries. Each dictionary should have two keys: 'topic_name' and 'summary'.\n"
            "Do not include any special characters outside the Python syntax.\n"
            "Example output format:\n"
            "[{'topic_name': 'Customer service', 'summary': 'The user feels frustrated with the slow and unhelpful service.'}"
            "  {'topic_name': 'Product quality', 'summary': 'The user is disappointed with the poor build quality.'}]"
        )

        try:
            logger.debug("Sending request to Groq API.")
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            summary = response.choices[0].message.content
            logger.info("Received response from Groq API.")
            return summary

        except Exception as e:
            logger.error(f"{type(e).__name__}: {e}")
            logger.exception("Unexpected error during summary generation.")
            raise
