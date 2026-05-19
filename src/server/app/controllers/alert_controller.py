from flask import jsonify, request
from ..services.alert_service import get_all_alerts, get_active_alerts, resolve_alert, create_alert


def list_alerts():
    active_only = request.args.get("active", "false").lower() == "true"
    alerts = get_active_alerts() if active_only else get_all_alerts()
    return jsonify(alerts)


def resolve(alert_id):
    return jsonify(resolve_alert(alert_id))


def new_alert():
    body = request.get_json(silent=True) or {}
    return jsonify(create_alert(
        body.get("type", "info"),
        body.get("message", ""),
        body.get("deviceId")
    )), 201
