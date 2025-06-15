import os
import logging
from typing import Optional
from dotenv import load_dotenv
from groq import Groq
from utils.log_config import setup_logger
import json
import re

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

    def generate_comparison(self, topics1: dict, topics2: dict) -> str:
        prompt = (
            "You will compare two sets of extracted emotion topics from two datasets.\n"
            "For each emotion present in either dataset, compare the main topics.\n"
            "Mention similarities and differences, if there are any. The output has to be user-friendly and short. Mention only the important parts.\n"
            "Analyze based only on the emotion and the LDA topics extracted.\n"
            "Only provide the plain text, no JSON or code blocks.\n\n"
            f"Dataset 1:\n{json.dumps(topics1, indent=2)}\n\n"
            f"Dataset 2:\n{json.dumps(topics2, indent=2)}"
        )

        try:
            logger.debug("Sending comparison prompt to Groq API.")
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            comparison_text = response.choices[0].message.content
            logger.info("Received comparison from Groq API.")
            return comparison_text

        except Exception as e:
            logger.error(f"{type(e).__name__}: {e}")
            logger.exception("Unexpected error during comparison generation.")
            raise
    
    def generate_summary(self, emotion_topics: dict) -> dict:

        prompt = (
            "You are analyzing reviews. For each emotion below, topics were extracted using LDA.\n"
            "Generate a summary for each emotion, consisting of short topic names and descriptions.\n"
            "Respond in valid JSON format. Each emotion should map to a list of topic summaries.\n"
            "Each topic summary must have two keys: \"topic_name\" and \"summary\".\n"
            "Use only double quotes for all strings and keys (as required in JSON).\n"
            "Respond ONLY with raw JSON. Do not include markdown, code blocks, or any explanation text.\n\n"
        )

        for emotion, topics in emotion_topics.items():
            prompt += f"Emotion: {emotion}\n"
            for i, words in enumerate(topics):
                prompt += f"{i+1}. {', '.join(words)}\n"
            prompt += "\n"

        prompt += (
            "Example format:\n"
            "{\n"
            "  \"joy\": [\n"
            "    {\"topic_name\": \"Helpful staff\", \"summary\": \"Users liked the polite and helpful staff.\"},\n"
            "    {\"topic_name\": \"Clean rooms\", \"summary\": \"Guests appreciated the cleanliness.\"}\n"
            "  ],\n"
            "  \"anger\": [\n"
            "    {\"topic_name\": \"Long wait\", \"summary\": \"Users complained about waiting times.\"}\n"
            "  ]\n"
            "}\n"
            "Respond ONLY with valid JSON. DO NOT include markdown code blocks, explanations, or formatting. Use straight double quotes and no trailing commas."
        )

        try:
            logger.debug("Sending request to Groq API.")
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            summary = response.choices[0].message.content
            logger.info("Received response from Groq API.")
            
            summary = summary.replace("“", "\"").replace("”", "\"")

            return json.loads(summary)

        except Exception as e:
            logger.error(f"{type(e).__name__}: {e}")
            logger.exception("Unexpected error during summary generation.")
            raise
