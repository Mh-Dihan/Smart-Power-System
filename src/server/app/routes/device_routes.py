from flask import Blueprint
from ..controllers.device_controller import list_devices, device_detail, update_status

device_bp = Blueprint("devices", __name__)

device_bp.route("/", methods=["GET"])(list_devices)
device_bp.route("/<device_id>", methods=["GET"])(device_detail)
device_bp.route("/<device_id>/status", methods=["PATCH"])(update_status)
