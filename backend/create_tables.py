from api.database import engine, Base
from models.prediction import Prediction

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")