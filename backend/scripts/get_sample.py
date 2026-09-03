import pandas as pd
import json

df = pd.read_csv("../data/transactions_clean.csv")
fraud_sample = df[df["Class"] == 1].iloc[0].drop("Class")
print(json.dumps(fraud_sample.to_dict(), indent=2))