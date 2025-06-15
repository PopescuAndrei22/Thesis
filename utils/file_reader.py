import pandas as pd
import os

def read_file(filepath: str, column: str) -> list[str]:
    ext = os.path.splitext(filepath)[1].lower()

    if ext == '.csv':
        df = pd.read_csv(filepath, usecols=[column], dtype={column: str})
    elif ext == '.json':
        df = pd.read_json(filepath)
        df = df[[column]].astype(str)
    else:
        raise ValueError("Invalid file type")

    reviews = df[column].dropna().tolist()
    return reviews
