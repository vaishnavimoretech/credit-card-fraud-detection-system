import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

df = pd.read_csv("../data/transactions_clean.csv")

amount_scaler = StandardScaler()
amount_scaler.fit(df[["Amount"]])

time_scaler = StandardScaler()
time_scaler.fit(df[["Time"]])

joblib.dump(amount_scaler, "../models/amount_scaler.pkl")
joblib.dump(time_scaler, "../models/time_scaler.pkl")

print("Scalers saved to backend/models/")