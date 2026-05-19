from flask import Blueprint
from ..controllers.power_controller import summary, history, live, predictions, anomaly, recommendations

power_bp = Blueprint("power", __name__)

power_bp.route("/summary", methods=["GET"])(summary)
power_bp.route("/history", methods=["GET"])(history)
power_bp.route("/live", methods=["GET"])(live)
power_bp.route("/predictions", methods=["GET"])(predictions)
power_bp.route("/anomaly", methods=["GET"])(anomaly)
power_bp.route("/recommendations", methods=["GET"])(recommendations)
