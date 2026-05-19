from flask import jsonify, request
from ..services.device_service import get_all_devices, get_device, update_device_status


def list_devices():
    return jsonify(get_all_devices())


def device_detail(device_id):
    device = get_device(device_id)
    if not device:
        return jsonify({"error": "Device not found"}), 404
    return jsonify(device)


def update_status(device_id):
    body = request.get_json(silent=True) or {}
    status = body.get("status")
    if status not in ("active", "idle", "maintenance", "off", "warning"):
        return jsonify({"error": "Invalid status"}), 400
    return jsonify(update_device_status(device_id, status))
