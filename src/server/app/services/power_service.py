import json
import os
import random
from datetime import datetime
from ..config import Config


def _load_data():
    path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "powerData.json")
    with open(path) as f:
        return json.load(f)


def get_summary():
    data = _load_data()
    summary = data["summary"]
    # Simulate live fluctuation
    summary["totalConsumption"] += random.randint(-200, 200)
    summary["totalGeneration"] += random.randint(-100, 100)
    summary["netLoad"] = summary["totalConsumption"] - summary["totalGeneration"]
    return summary


def get_power_history():
    data = _load_data()
    return data["powerHistory"]


def get_live_reading():
    data = _load_data()
    devices = data["devices"]
    total = sum(d["power"] for d in devices if d["power"] > 0)
    generation = abs(sum(d["power"] for d in devices if d["power"] < 0))
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "totalConsumption": round(total + random.uniform(-150, 150), 1),
        "totalGeneration": round(generation + random.uniform(-50, 50), 1),
        "frequency": round(50.0 + random.uniform(-0.05, 0.05), 3),
        "gridVoltage": round(220 + random.uniform(-2, 2), 1),
    }
