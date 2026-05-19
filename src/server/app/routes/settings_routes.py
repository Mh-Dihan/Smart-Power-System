from flask import Blueprint
from ..controllers.settings_controller import read_settings, update_settings

settings_bp = Blueprint("settings", __name__)

settings_bp.route("", methods=["GET"])(read_settings)
settings_bp.route("/", methods=["GET"])(read_settings)
settings_bp.route("", methods=["PUT"])(update_settings)
settings_bp.route("/", methods=["PUT"])(update_settings)
