from sqlalchemy import Column, Integer, Float, Boolean, DateTime
from api.database import Base
from datetime import datetime

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    fraud_probability = Column(Float)
    is_fraud = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)