import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("../data/transactions_clean.csv")

# Scale Amount
scaler = StandardScaler()
df["Amount_scaled"] = scaler.fit_transform(df[["Amount"]])

# Convert Time (seconds) into Hour of day (0-23) - more meaningful than raw seconds
df["Hour"] = (df["Time"] // 3600) % 24

# Scale Time too, for consistency with V1-V28
df["Time_scaled"] = scaler.fit_transform(df[["Time"]])

# Drop originals, keep engineered versions
df = df.drop(columns=["Time", "Amount"])

df.to_csv("../data/transactions_features.csv", index=False)
print("Saved feature-engineered dataset:", df.shape)
print(df.columns.tolist())