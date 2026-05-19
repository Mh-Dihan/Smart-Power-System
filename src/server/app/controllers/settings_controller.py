from flask import jsonify, request
from ..services.settings_service import get_settings, save_settings


def read_settings():
    return jsonify(get_settings())


def update_settings():
    body = request.get_json(silent=True) or {}
    return jsonify(save_settings(body))
