import os
import pytest
from unittest.mock import patch, MagicMock
from nlp.llm import TopicSummarizer, ConfigError

@patch.dict(os.environ, {}, clear=True)
def test_missing_api_key_raises_error():
    with pytest.raises(ConfigError):
        TopicSummarizer()

@patch.dict(os.environ, {"GROQ_API_KEY": "fake-key"})
@patch("nlp.llm.Groq")
def test_generate_comparison_returns_text(mock_groq):
    mock_client = MagicMock()
    mock_groq.return_value = mock_client
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="Comparison result text."))]
    mock_client.chat.completions.create.return_value = mock_response

    summarizer = TopicSummarizer()
    result = summarizer.generate_comparison({"joy": ["topic1"]}, {"joy": ["topic2"]})

    assert "Comparison result text." in result

@patch.dict(os.environ, {"GROQ_API_KEY": "fake-key"})
@patch("nlp.llm.Groq")
def test_generate_summary_returns_json(mock_groq):
    mock_client = MagicMock()
    mock_groq.return_value = mock_client
    fake_json = '{"joy": [{"topic_name": "Happy Staff", "summary": "They were helpful"}]}'
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content=fake_json))]
    mock_client.chat.completions.create.return_value = mock_response

    summarizer = TopicSummarizer()
    result = summarizer.generate_summary({"joy": [["happy", "friendly", "staff"]]})

    assert isinstance(result, dict)
    assert "joy" in result
    assert result["joy"][0]["topic_name"] == "Happy Staff"
