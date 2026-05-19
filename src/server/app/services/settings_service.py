import json
import os
from datetime import datetime, timezone

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "settings.json")

DEFAULT_SETTINGS = {
    "refreshInterval": "5",
    "alertThreshold": "2.5",
    "peakStart": "18",
    "peakEnd": "22",
    "currency": "USD",
    "tariffRate": "0.15",
    "notifications": True,
    "darkMode": True,
    "systemStatus": "online",
}

NUMERIC_LIMITS = {
    "refreshInterval": (1, 60, 0),
    "alertThreshold": (1, 5, 1),
    "peakStart": (0, 23, 0),
    "peakEnd": (0, 23, 0),
    "tariffRate": (0, 100, 2),
}

VALID_CURRENCIES = {"USD", "EUR", "GBP", "BDT"}
VALID_STATUSES = {"online", "offline"}


def _ensure_file():
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    if not os.path.exists(DATA_PATH):
        save_settings(DEFAULT_SETTINGS)


def get_settings():
    _ensure_file()
    with open(DATA_PATH) as f:
        stored = json.load(f)
    return _normalize_settings(stored)


def _bounded_number(value, minimum, maximum, decimals):
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        numeric = minimum

    numeric = min(max(numeric, minimum), maximum)
    if decimals == 0:
        return str(int(round(numeric)))
    return f"{numeric:.{decimals}f}".rstrip("0").rstrip(".")


def _normalize_settings(settings):
    source = {**DEFAULT_SETTINGS, **(settings or {})}
    normalized = {}

    for key, value in source.items():
        if key in NUMERIC_LIMITS:
            normalized[key] = _bounded_number(value, *NUMERIC_LIMITS[key])
        elif key == "currency":
            normalized[key] = value if value in VALID_CURRENCIES else DEFAULT_SETTINGS[key]
        elif key == "systemStatus":
            normalized[key] = value if value in VALID_STATUSES else DEFAULT_SETTINGS[key]
        elif key in ("notifications", "darkMode"):
            normalized[key] = bool(value)
        elif key != "updatedAt":
            normalized[key] = value

    return {**DEFAULT_SETTINGS, **normalized}


def save_settings(settings):
    next_settings = _normalize_settings(settings)
    next_settings["updatedAt"] = datetime.now(timezone.utc).isoformat()
    with open(DATA_PATH, "w") as f:
        json.dump(next_settings, f, indent=2)
    return next_settings
