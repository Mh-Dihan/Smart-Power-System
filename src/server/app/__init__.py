from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from .routes.power_routes import power_bp
    from .routes.device_routes import device_bp
    from .routes.alert_routes import alert_bp
    from .routes.settings_routes import settings_bp

    app.register_blueprint(power_bp, url_prefix="/api/power")
    app.register_blueprint(device_bp, url_prefix="/api/devices")
    app.register_blueprint(alert_bp, url_prefix="/api/alerts")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "smart-power-api"})

    @app.get("/api")
    def api_index():
        return jsonify({
            "status": "ok",
            "sections": ["power", "devices", "alerts", "settings"],
            "endpoints": {
                "power": [
                    "/api/power/summary",
                    "/api/power/history",
                    "/api/power/live",
                    "/api/power/predictions",
                    "/api/power/anomaly",
                    "/api/power/recommendations",
                ],
                "devices": ["/api/devices/", "/api/devices/<id>", "/api/devices/<id>/status"],
                "alerts": ["/api/alerts/", "/api/alerts/<id>/resolve"],
                "settings": ["/api/settings/"],
            },
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "status": 404}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Server error", "status": 500}), 500

    with app.app_context():
        db.create_all()

    return app
