import json
import os
from ..ai.model import get_predictor
from .device_service import get_all_devices


def get_predictions(hours: int = 6):
    predictor = get_predictor()
    devices = get_all_devices()
    current_power = sum(d.get("power", 0) for d in devices if d.get("power", 0) > 0)
    return predictor.predict_next_hours(current_power, hours)


def get_anomaly_status():
    predictor = get_predictor()
    # Simulate recent readings
    import random
    readings = [14000 + random.uniform(-800, 800) for _ in range(9)]
    readings.append(readings[-1] * 1.35)  # Spike on last
    return predictor.detect_anomaly(readings)


def get_recommendations():
    predictor = get_predictor()
    devices = get_all_devices()
    return predictor.recommend_optimization(devices)
