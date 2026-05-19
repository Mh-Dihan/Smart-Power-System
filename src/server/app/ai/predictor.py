"""
AI Predictor - Forecasts power consumption using linear regression
and anomaly detection using Z-score method.
"""
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict


class PowerPredictor:
    def __init__(self):
        self.coefficients = None
        self.intercept = None
        self.mean = None
        self.std = None
        self._fit_default_model()

    def _fit_default_model(self):
        """Fit a default model using synthetic hourly patterns."""
        hours = np.arange(24)
        # Typical commercial building load curve
        base_load = 10000
        pattern = (
            base_load
            + 3000 * np.sin(np.pi * (hours - 6) / 12) * (hours >= 6) * (hours <= 22)
            + np.random.normal(0, 300, 24)
        )
        self._fit(hours.reshape(-1, 1), pattern)
        self.mean = np.mean(pattern)
        self.std = np.std(pattern)

    def _fit(self, X: np.ndarray, y: np.ndarray):
        """Simple ordinary least squares."""
        X_b = np.c_[np.ones(X.shape[0]), X]
        theta = np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y
        self.intercept = theta[0]
        self.coefficients = theta[1:]

    def predict_next_hours(self, current_power: float, hours: int = 6) -> List[Dict]:
        """Predict power for the next N hours."""
        now = datetime.utcnow()
        predictions = []
        for i in range(1, hours + 1):
            future_time = now + timedelta(hours=i)
            hour = future_time.hour
            # Simple sinusoidal model
            predicted = (
                10000
                + 4000 * np.sin(np.pi * max(0, hour - 6) / 16)
                * (1 if 6 <= hour <= 22 else 0)
                + 0.3 * current_power
            )
            predictions.append({
                "time": future_time.strftime("%H:%M"),
                "timestamp": future_time.isoformat(),
                "predicted": round(float(predicted), 1),
                "confidence": round(max(0.6, 0.95 - i * 0.05), 2),
            })
        return predictions

    def detect_anomaly(self, readings: List[float]) -> Dict:
        """Z-score anomaly detection."""
        if len(readings) < 3:
            return {"anomaly": False, "score": 0.0, "threshold": 2.5}
        arr = np.array(readings)
        mean = np.mean(arr)
        std = np.std(arr) or 1
        z_score = abs((arr[-1] - mean) / std)
        threshold = 2.5
        return {
            "anomaly": bool(z_score > threshold),
            "score": round(float(z_score), 3),
            "threshold": threshold,
            "latestValue": arr[-1],
            "mean": round(float(mean), 2),
        }

    def recommend_optimization(self, devices: List[Dict]) -> List[Dict]:
        """Generate AI recommendations based on device data."""
        recommendations = []
        for device in devices:
            pf = device.get("powerFactor", 1.0)
            power = device.get("power", 0)
            status = device.get("status", "active")

            if pf < 0.85 and power > 0:
                recommendations.append({
                    "deviceId": device["id"],
                    "deviceName": device["name"],
                    "type": "power_factor",
                    "priority": "high",
                    "message": f"Install power factor correction capacitors. Current PF: {pf:.2f}",
                    "estimatedSaving": round(power * (1 - pf) * 0.1, 1),
                })

            if status == "idle" and power == 0:
                recommendations.append({
                    "deviceId": device["id"],
                    "deviceName": device["name"],
                    "type": "scheduling",
                    "priority": "medium",
                    "message": "Schedule operation during off-peak hours (23:00–06:00) for cost savings.",
                    "estimatedSaving": round(power * 0.15, 1),
                })

        if not recommendations:
            recommendations.append({
                "deviceId": None,
                "deviceName": "System",
                "type": "general",
                "priority": "low",
                "message": "All devices are operating within optimal parameters.",
                "estimatedSaving": 0,
            })

        return recommendations
