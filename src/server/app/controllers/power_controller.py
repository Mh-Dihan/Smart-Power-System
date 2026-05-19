from flask import jsonify, request
from ..services.power_service import get_summary, get_power_history, get_live_reading
from ..services.ai_service import get_predictions, get_anomaly_status, get_recommendations


def summary():
    return jsonify(get_summary())


def history():
    return jsonify(get_power_history())


def live():
    return jsonify(get_live_reading())


def predictions():
    hours = request.args.get("hours", 6, type=int)
    return jsonify(get_predictions(hours))


def anomaly():
    return jsonify(get_anomaly_status())


def recommendations():
    return jsonify(get_recommendations())
