import logging
import os

def setup_logger(name: str, log_file: str = "logs/app.log") -> logging.Logger:
    """Sets up a logger with both file and console handlers."""

    level_str = os.getenv("LOG_LEVEL", "INFO")  # default is INFO
    level = getattr(logging, level_str.upper(), logging.INFO)

    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")

    # file handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(formatter)

    # console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    logger.propagate = False  # avoid duplicate logs

    return logger
