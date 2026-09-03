import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("../data/transactions_clean.csv")

# 1. Class distribution
plt.figure(figsize=(6,4))
sns.countplot(x="Class", data=df)
plt.title("Legit (0) vs Fraud (1) Count")
plt.savefig("../data/class_distribution.png")
plt.close()

# 2. Amount distribution: fraud vs legit
plt.figure(figsize=(8,4))
sns.boxplot(x="Class", y="Amount", data=df)
plt.title("Transaction Amount by Class")
plt.ylim(0, 500)  # zoom in, since outliers dominate
plt.savefig("../data/amount_by_class.png")
plt.close()

# 3. Fraud over time
plt.figure(figsize=(8,4))
sns.histplot(data=df, x="Time", hue="Class", bins=50, stat="density", common_norm=False)
plt.title("Transaction Time Distribution: Legit vs Fraud")
plt.savefig("../data/time_distribution.png")
plt.close()

print("Saved 3 charts to backend/data/")