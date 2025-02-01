from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()
model = joblib.load('../Models/wildfire_model.pkl')
le = joblib.load('../Models/label_encoder.pkl')

class PredictionRequest(BaseModel):
    start_date: str
    end_date: str

class EnvironmentData(BaseModel):
    timestamp: str
    temperature: float
    humidity: float
    wind_speed: float
    precipitation: float
    vegetation_index: float
    human_activity_index: float
    latitude: float
    longitude: float

@app.post("/predict")
async def predict(data: list[EnvironmentData]):
    features = [[
        d.temperature,
        d.humidity,
        d.wind_speed,
        d.precipitation,
        d.vegetation_index,
        d.human_activity_index
    ] for d in data]
    
    df = pd.DataFrame(features, columns=[
        'temperature', 'humidity', 'wind_speed',
        'precipitation', 'vegetation_index', 'human_activity_index'
    ])
    
    predictions = le.inverse_transform(model.predict(df))
    return {"predictions": predictions.tolist()}