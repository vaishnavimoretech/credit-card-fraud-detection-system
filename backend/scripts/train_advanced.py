import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

df = pd.read_csv("../data/transactions_features.csv")
X = df.drop(columns=["Class"])
y = df["Class"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- Random Forest ---
rf = RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)

print("=== Random Forest ===")
print(confusion_matrix(y_test, rf_pred))
print(classification_report(y_test, rf_pred))
joblib.dump(rf, "../models/random_forest_model.pkl")

# --- XGBoost ---
scale = (y_train == 0).sum() / (y_train == 1).sum()  # handles imbalance
xgb = XGBClassifier(scale_pos_weight=scale, eval_metric="logloss", random_state=42)
xgb.fit(X_train, y_train)
xgb_pred = xgb.predict(X_test)

print("\n=== XGBoost ===")
print(confusion_matrix(y_test, xgb_pred))
print(classification_report(y_test, xgb_pred))
joblib.dump(xgb, "../models/xgboost_model.pkl")