import pandas as pd

df = pd.read_csv("../data/transactions.csv")

print("Fraud count:\n", df['Class'].value_counts())
print("\nFraud %:\n", df['Class'].value_counts(normalize=True) * 100)
print("\nMissing values:\n", df.isnull().sum().sum())
print("\nAmount stats:\n", df['Amount'].describe())