import pandas as pd

df = pd.read_csv("../data/transactions.csv")

print("Duplicate rows:", df.duplicated().sum())

df = df.drop_duplicates()
print("Shape after dedup:", df.shape)

df.to_csv("../data/transactions_clean.csv", index=False)
print("Saved cleaned file: transactions_clean.csv")