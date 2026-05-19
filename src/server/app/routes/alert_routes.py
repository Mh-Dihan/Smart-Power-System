from flask import Blueprint
from ..controllers.alert_controller import list_alerts, resolve, new_alert

alert_bp = Blueprint("alerts", __name__)

alert_bp.route("/", methods=["GET"])(list_alerts)
alert_bp.route("/", methods=["POST"])(new_alert)
alert_bp.route("/<alert_id>/resolve", methods=["PATCH"])(resolve)
