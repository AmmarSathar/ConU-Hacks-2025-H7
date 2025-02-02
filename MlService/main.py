from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import io
from typing import Dict
import heapq
from collections import defaultdict

app = FastAPI()
model = joblib.load('Models/wildfire_model.pkl')
le = joblib.load('Models/label_encoder.pkl')

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

@app.post("/optimize-resources")
async def optimize_resources(csv_file: UploadFile = File(...)):
    try:
        # Read CSV from uploaded file
        contents = await csv_file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate CSV structure
        required_columns = ['timestamp.date', 'fire_start_time', 'location', 
                          'severity', 'latitude', 'longitude']
        if not all(col in df.columns for col in required_columns):
            return {"error": "CSV missing required columns"}
            
        # Run optimization logic (modified version of your script)
        results = run_optimization(df)
        
        return results
        
    except Exception as e:
        return {"error": str(e)}
    
def run_optimization(df: pd.DataFrame) -> Dict:
    # Convert fire_start_time to datetime and compute minutes since midnight
    df["fire_start_time"] = pd.to_datetime(df["fire_start_time"])
    df["fire_start_minutes"] = df["fire_start_time"].dt.hour * 60 + df["fire_start_time"].dt.minute

    # Define available resources (with deploy time in minutes, cost, and available count)
    resources = {
        "Smoke Jumpers": {"deploy_time": 30, "cost": 5000, "available": 5},
        "Fire Engines": {"deploy_time": 60, "cost": 2000, "available": 10},
        "Helicopters": {"deploy_time": 45, "cost": 8000, "available": 3},
        "Tanker Planes": {"deploy_time": 120, "cost": 15000, "available": 2},
        "Ground Crews": {"deploy_time": 90, "cost": 3000, "available": 8}
    }

    # Damage costs for fires not addressed by available resources
    damage_costs = {"low": 50000, "medium": 100000, "high": 200000}

    # Map severity to a priority (high fires get addressed first)
    severity_priority = {"high": 3, "medium": 2, "low": 1}
    df["severity_priority"] = df["severity"].map(severity_priority)
    # Sort by severity (descending) and then by fire_start_minutes (ascending)
    df = df.sort_values(by=["severity_priority", "fire_start_minutes"], ascending=[False, True])

    # Initialize a priority queue (for scheduling, if needed) and counters
    queue = []  # (completion_time, resource_unit)
    available_resources = {unit: data["available"] for unit, data in resources.items()}
    deployed_resources = defaultdict(int)
    total_operational_cost = 0
    total_damage_cost = 0
    fires_missed = {"low": 0, "medium": 0, "high": 0}
    fires_addressed = {"low": 0, "medium": 0, "high": 0}

    # Process each fire report
    for _, fire in df.iterrows():
        fire_time = fire["fire_start_minutes"]
        severity = fire["severity"]
        assigned = False

        # Try to deploy a resource: check all resources sorted by deploy time
        for unit, data in sorted(resources.items(), key=lambda x: x[1]['deploy_time']):
            if available_resources[unit] > 0:
                # "Deploy" resource by pushing its finish time on the queue (if needed later)
                heapq.heappush(queue, (fire_time + data["deploy_time"], unit))
                available_resources[unit] -= 1
                deployed_resources[unit] += 1
                total_operational_cost += data["cost"]
                fires_addressed[severity] += 1
                assigned = True
                break

        # If no resource is available, count the fire as missed/delayed
        if not assigned:
            total_damage_cost += damage_costs[severity]
            fires_missed[severity] += 1

    return {
        "fires_addressed": sum(fires_addressed.values()),
        "fires_delayed": sum(fires_missed.values()),
        "operational_cost": total_operational_cost,
        "damage_cost": total_damage_cost,
        "severity_breakdown": {
            "addressed": fires_addressed,
            "delayed": fires_missed
        },
        "resource_usage": dict(deployed_resources)
    }