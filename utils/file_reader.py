import pandas as pd
import os

def read_file(filepath: str, column: str) -> list[str]:
    ext = os.path.splitext(filepath)[1].lower()

    if ext == '.csv':
        df = pd.read_csv(filepath, usecols=[column], dtype={column: str}, nrows=1500)
    elif ext == '.json':
        df = pd.read_json(filepath)
        df = df[[column]].astype(str).head(1500)
    else:
        raise ValueError("Format de fisier nesuportat. Doar CSV si JSON sunt acceptate.")

    reviews = df[column].dropna().tolist()
    return reviews
