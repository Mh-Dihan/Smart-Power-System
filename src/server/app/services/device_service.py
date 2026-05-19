import json
import os
import random

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "powerData.json")


def _load():
    with open(DATA_PATH) as f:
        return json.load(f)


def get_all_devices():
    data = _load()
    devices = data["devices"]
    # Simulate live power fluctuation for active devices
    for d in devices:
        if d["status"] == "active" and d["power"] != 0:
            d["power"] = round(d["power"] + random.uniform(-50, 50), 1)
    return devices


def get_device(device_id: str):
    devices = get_all_devices()
    return next((d for d in devices if d["id"] == device_id), None)


def update_device_status(device_id: str, status: str):
    # In production this would write to the DB; here we return mock response
    return {"id": device_id, "status": status, "updated": True}
