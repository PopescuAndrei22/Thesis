import pandas as pd

def read_file(filepath: str) -> list[str]:
    df = pd.read_csv(filepath, usecols=['reviewText'], dtype={'reviewText': str}, nrows=1000)
    reviews = df['reviewText'].dropna().tolist()

    return reviews