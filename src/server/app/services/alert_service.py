import json
import os
from datetime import datetime

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "powerData.json")


def get_all_alerts():
    with open(DATA_PATH) as f:
        data = json.load(f)
    return data["alerts"]


def get_active_alerts():
    return [a for a in get_all_alerts() if not a["resolved"]]


def resolve_alert(alert_id: str):
    return {"id": alert_id, "resolved": True, "resolvedAt": datetime.utcnow().isoformat()}


def create_alert(alert_type: str, message: str, device_id: str = None):
    return {
        "id": f"a_{datetime.utcnow().timestamp()}",
        "type": alert_type,
        "message": message,
        "device": device_id,
        "timestamp": datetime.utcnow().isoformat(),
        "resolved": False,
    }
