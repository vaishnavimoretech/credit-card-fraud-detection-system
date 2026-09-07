from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .auth import router as auth_router
from api.database import SessionLocal
from models.prediction import Prediction
from fastapi import UploadFile, File,  HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from api.models import User
from reportlab.pdfgen import canvas
from fastapi import HTTPException
import tempfile
import pandas as pd
import joblib
import numpy as np


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://credit-card-fraud-detection-system-livid.vercel.app"
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


class SimpleTransaction(BaseModel):
    amount: float


class Transaction(BaseModel):
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float
    Time: float


try:
    model = joblib.load("models/xgboost_model.pkl")
    amount_scaler = joblib.load("models/amount_scaler.pkl")
    time_scaler = joblib.load("models/time_scaler.pkl")

    dataset = pd.read_csv("data/prediction_samples.csv")
    print("Dataset loaded:", dataset.shape)
    MODEL_LOADED = True

except Exception as error:
    print("MODEL LOADING ERROR:", error)
    MODEL_LOADED = False


prediction_history = []


@app.get("/")
def root():
    return {
        "message": "AI Credit Card Fraud Detection API Running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.post("/predict-simple")
def predict_simple(transaction: SimpleTransaction):
    print("PREDICT SIMPLE CALLED")
    if not MODEL_LOADED:
        return {
            "error": "ML model not loaded"
        }

    try:

        sample = dataset.sample(1).iloc[0]

        amount_scaled = amount_scaler.transform(
            [[transaction.amount]]
        )[0][0]

        time_scaled = time_scaler.transform(
            [[sample["Time"]]]
        )[0][0]

        hour = (sample["Time"] // 3600) % 24

        features = [
            sample["V1"],
            sample["V2"],
            sample["V3"],
            sample["V4"],
            sample["V5"],
            sample["V6"],
            sample["V7"],
            sample["V8"],
            sample["V9"],
            sample["V10"],
            sample["V11"],
            sample["V12"],
            sample["V13"],
            sample["V14"],
            sample["V15"],
            sample["V16"],
            sample["V17"],
            sample["V18"],
            sample["V19"],
            sample["V20"],
            sample["V21"],
            sample["V22"],
            sample["V23"],
            sample["V24"],
            sample["V25"],
            sample["V26"],
            sample["V27"],
            sample["V28"],
            amount_scaled,
            hour,
            time_scaled,
        ]

        X = np.array(features).reshape(1, -1)

        prediction = model.predict(X)[0]

        probability = model.predict_proba(X)[0][1]

        print("Prediction:", prediction)
        print("Probability:", probability)
        print("Type:", type(probability))

        is_fraud = bool(prediction)

        fraud_probability = round(
            float(probability),
            4
        )

        db = SessionLocal()

        record = Prediction(
            amount=float(transaction.amount),
            fraud_probability=fraud_probability,
            is_fraud=is_fraud
        )

        db.add(record)
        db.commit()
        db.close()

        return {
            "amount": float(transaction.amount),
            "is_fraud": is_fraud,
            "fraud_probability": fraud_probability
        }

    except Exception as error:

     print("ERROR:", error)

     return {
        "error": str(error)
    }
@app.post("/predict")
def predict(transaction: Transaction):

    if not MODEL_LOADED:
        return {
            "error": "ML model not loaded"
        }

    try:
        # -----------------------------
        # Scale Amount
        # -----------------------------
        amount_scaled = amount_scaler.transform(
            [[transaction.Amount]]
        )[0][0]

        # -----------------------------
        # Scale Time
        # -----------------------------
        time_scaled = time_scaler.transform(
            [[transaction.Time]]
        )[0][0]

        # -----------------------------
        # Create Hour feature
        # -----------------------------
        hour = (transaction.Time // 3600) % 24

        # -----------------------------
        # Feature order
        # -----------------------------
        features = [
            transaction.V1,
            transaction.V2,
            transaction.V3,
            transaction.V4,
            transaction.V5,
            transaction.V6,
            transaction.V7,
            transaction.V8,
            transaction.V9,
            transaction.V10,
            transaction.V11,
            transaction.V12,
            transaction.V13,
            transaction.V14,
            transaction.V15,
            transaction.V16,
            transaction.V17,
            transaction.V18,
            transaction.V19,
            transaction.V20,
            transaction.V21,
            transaction.V22,
            transaction.V23,
            transaction.V24,
            transaction.V25,
            transaction.V26,
            transaction.V27,
            transaction.V28,
            amount_scaled,
            hour,
            time_scaled,
        ]

        X = np.array(features).reshape(1, -1)

        # -----------------------------
        # ML Prediction
        # -----------------------------
        prediction = model.predict(X)[0]

        probability = model.predict_proba(X)[0][1]

        is_fraud = bool(prediction)
        fraud_probability = round(float(probability), 4)
        

        # -----------------------------
        # Save prediction to database
        # -----------------------------
        db = SessionLocal()

        try:
            record = Prediction(
                amount=float(transaction.Amount),
                fraud_probability=fraud_probability,
                is_fraud=is_fraud
            )

            db.add(record)
            db.commit()
            db.refresh(record)

        finally:
            db.close()

        # -----------------------------
        # Response
        # -----------------------------
        result = {
            "id": record.id,
            "amount": float(transaction.Amount),
            "is_fraud": is_fraud,
            "fraud_probability": fraud_probability,
            "status": "Fraud" if is_fraud else "Safe"
        }

        return result

    except Exception as error:
        print("PREDICTION ERROR:", error)

        return {
            "error": str(error)
        }


@app.get("/history")
def get_history():
    db = SessionLocal()

    try:
        records = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(100)
            .all()
        )

        result = []

        for item in records:
            result.append({
                "id": item.id,
                "amount": float(item.amount),
                "fraud_probability": float(item.fraud_probability),
                "is_fraud": bool(item.is_fraud),
                "created_at": (
                    item.created_at.isoformat()
                    if item.created_at
                    else None
                )
            })

        return result

    except Exception as error:
        print("HISTORY ERROR:", error)

        return {
            "error": str(error)
        }

    finally:
        db.close()

@app.get("/transactions")
def get_transactions():
    db = SessionLocal()

    try:
        records = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(100)
            .all()
        )

        result = []

        for item in records:
            result.append({
                "id": item.id,
                "amount": float(item.amount),
                "fraud_probability": float(item.fraud_probability),
                "status": "Fraud" if item.is_fraud else "Safe",
                "created_at": item.created_at.isoformat()
                if item.created_at
                else None
            })

        return result

    finally:
        db.close()

@app.get("/analytics")
def analytics():
    db = SessionLocal()

    try:
        records = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(100)
            .all()
        )

        total = len(records)

        fraud_count = sum(
            1 for r in records
            if r.is_fraud
        )

        safe_count = total - fraud_count

        fraud_rate = (
            round((fraud_count / total) * 100, 2)
            if total > 0
            else 0
        )

        average_risk = (
            round(
                sum(
                    float(r.fraud_probability)
                    for r in records
                ) / total * 100,
                2
            )
            if total > 0
            else 0
        )

        trend = []

        for index, record in enumerate(
            reversed(records),
            start=1
        ):
            trend.append({
                "transaction": f"T{index}",
                "risk": round(
                    float(record.fraud_probability) * 100,
                    2
                ),
                "status": (
                    "Fraud"
                    if record.is_fraud
                    else "Safe"
                )
            })

        return {
            "total_transactions": total,
            "fraud_transactions": fraud_count,
            "safe_transactions": safe_count,
            "fraud_rate": fraud_rate,
            "average_risk": average_risk,
            "risk_distribution": [
                {
                    "name": "Fraud",
                    "value": fraud_count
                },
                {
                    "name": "Safe",
                    "value": safe_count
                }
            ],
            "fraud_trend": trend
        }

    finally:
        db.close()

@app.get("/latest-alert")
def latest_alert():

    db = SessionLocal()

    try:
        latest = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .first()
        )

        if not latest:
            return {
                "alert": False
            }

        return {
            "alert": latest.fraud_probability >= 0.70,
            "risk": round(
                latest.fraud_probability * 100,
                2
            ),
            "amount": latest.amount
        }

    finally:
        db.close()

@app.get("/dashboard-stats")
def dashboard_stats():
    db = SessionLocal()

    try:
        total_transactions = db.query(Prediction).count()

        fraud_transactions = (
            db.query(Prediction)
            .filter(Prediction.is_fraud == True)
            .count()
        )

        safe_transactions = total_transactions - fraud_transactions

        if total_transactions > 0:
            fraud_rate = (
                fraud_transactions / total_transactions
            ) * 100
        else:
            fraud_rate = 0

        accuracy = (
            safe_transactions / total_transactions
        ) * 100 if total_transactions > 0 else 0

        return {
            "total_transactions": total_transactions,
            "fraud_transactions": fraud_transactions,
            "safe_transactions": safe_transactions,
            "risk_score": round(fraud_rate, 2),
            "accuracy": round(accuracy, 2),
        }

    finally:
        db.close()
        
@app.get("/fraud-trend")
def fraud_trend():

    db = SessionLocal()

    try:
        records = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(100)
            .all()
        )

        records.reverse()

        result = []

        for i, item in enumerate(records, start=1):
            result.append({
                "transaction": f"T{i}",
                "fraud": round(
                    float(item.fraud_probability) * 100,
                    2
                )
            })

        return result

    finally:
        db.close()

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    try:
        # Check file type
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are allowed."
            )

        # Read CSV
        df = pd.read_csv(
            file.file,
            encoding="latin1"
        )

        # Required columns
        required_columns = [
            "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8",
            "V9", "V10", "V11", "V12", "V13", "V14", "V15",
            "V16", "V17", "V18", "V19", "V20", "V21", "V22",
            "V23", "V24", "V25", "V26", "V27", "V28",
            "Amount", "Time"
        ]

        # Check required columns
        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Invalid CSV format",
                    "missing_columns": missing_columns
                }
            )

        # Keep required features
        data = df[required_columns].copy()

        # Convert values to numeric
        for column in required_columns:
            data[column] = pd.to_numeric(
                data[column],
                errors="coerce"
            )

        # Remove invalid rows
        data = data.dropna()

        if len(data) == 0:
            raise HTTPException(
                status_code=400,
                detail="CSV does not contain valid transaction data."
            )

        # Scale Amount
        data["Amount_scaled"] = amount_scaler.transform(
            data[["Amount"]]
        ).ravel()

        # Scale Time
        data["Time_scaled"] = time_scaler.transform(
            data[["Time"]]
        ).ravel()

        # Create Hour feature
        data["Hour"] = (
            (data["Time"] // 3600) % 24
        )

        # Final feature order
        features = [
            "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8",
            "V9", "V10", "V11", "V12", "V13", "V14", "V15",
            "V16", "V17", "V18", "V19", "V20", "V21", "V22",
            "V23", "V24", "V25", "V26", "V27", "V28",
            "Amount_scaled",
            "Hour",
            "Time_scaled"
        ]

        # Model input
        X = data[features].values

        # XGBoost prediction
        predictions = model.predict(X)
        probabilities = model.predict_proba(X)[:, 1]

        # Counts
        fraud_count = int(
            np.sum(predictions == 1)
        )

        total_rows = len(predictions)

        safe_count = total_rows - fraud_count

        # Fraud rate
        fraud_rate = (
            round(
                (fraud_count / total_rows) * 100,
                2
            )
            if total_rows > 0
            else 0
        )

        # Average probability
        average_probability = round(
            float(np.mean(probabilities)),
            4
        )

        # Save predictions
        db = SessionLocal()

        try:
            records = []

            for index in range(total_rows):
                record = Prediction(
                    amount=float(
                        data.iloc[index]["Amount"]
                    ),
                    fraud_probability=round(
                        float(probabilities[index]),
                        4
                    ),
                    is_fraud=bool(
                        predictions[index]
                    )
                )

                records.append(record)

            db.add_all(records)
            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

        # Response
        return {
            "total_transactions": total_rows,
            "fraud_transactions": fraud_count,
            "safe_transactions": safe_count,
            "fraud_rate": fraud_rate,
            "average_fraud_probability": average_probability
        }

    except HTTPException:
        raise

    except Exception as error:
        print("CSV ANALYSIS ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
    
@app.get("/export-history")
def export_history():

    db = SessionLocal()

    records = db.query(Prediction).all()

    data = []

    for item in records:
        data.append({
            "id": item.id,
            "amount": item.amount,
            "fraud_probability": item.fraud_probability,
            "is_fraud": item.is_fraud,
            "created_at": item.created_at
        })

    df = pd.DataFrame(data)

    file_name = "prediction_history.csv"

    df.to_csv(file_name, index=False)

    db.close()

    return FileResponse(
        file_name,
        media_type="text/csv",
        filename=file_name
    )
@app.get("/risk-gauge")
def risk_gauge():

    db = SessionLocal()

    total = db.query(Prediction).count()

    fraud = (
        db.query(Prediction)
        .filter(Prediction.is_fraud == True)
        .count()
    )

    risk = (
        round((fraud / total) * 100, 2)
        if total > 0
        else 0
    )

    db.close()

    return {
        "risk_score": risk
    }



@app.get("/notifications")
def get_notifications():
    return [
        {
            "id": 1,
            "message": "Fraud transaction detected: ₹9500",
            "time": "2 min ago"
        },
        {
            "id": 2,
            "message": "High risk transaction detected: ₹8500",
            "time": "10 min ago"
        }
    ]
@app.get("/export-pdf")
def export_pdf():

    db = SessionLocal()

    try:
        predictions = (
            db.query(Prediction)
            .order_by(Prediction.id.desc())
            .limit(100)
            .all()
        )

        pdf_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        c = canvas.Canvas(pdf_file.name)

        c.setFont("Helvetica-Bold", 16)
        c.drawString(
            50,
            800,
            "FraudAI Analysis Report"
        )

        y = 760

        for item in predictions:

            status = (
                "Fraud"
                if item.is_fraud
                else "Safe"
            )

            line = (
                f"Amount: ₹{item.amount} | "
                f"Risk: {item.fraud_probability*100:.2f}% | "
                f"Status: {status}"
            )

            c.drawString(
                50,
                y,
                line
            )

            y -= 20

            if y < 50:
                c.showPage()
                y = 800

        c.save()

        return FileResponse(
            pdf_file.name,
            media_type="application/pdf",
            filename="FraudAI_Report.pdf"
        )

    finally:
        db.close()

@app.delete("/history/{prediction_id}")
def delete_prediction(prediction_id: int):

    db = SessionLocal()

    try:
        record = (
            db.query(Prediction)
            .filter(Prediction.id == prediction_id)
            .first()
        )

        if not record:
            return {
                "success": False,
                "message": "Record not found"
            }

        db.delete(record)
        db.commit()

        return {
            "success": True,
            "message": "Record deleted"
        }

    finally:
        db.close() 
        
@app.delete("/history")
def clear_history():
    db = SessionLocal()

    try:
        db.query(Prediction).delete()
        db.commit()

        return {
            "message": "All history deleted successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        db.close()