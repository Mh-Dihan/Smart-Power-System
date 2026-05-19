from .. import db
from datetime import datetime

class PowerReading(db.Model):
    __tablename__ = "power_readings"

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    power = db.Column(db.Float, nullable=False)       # Watts
    voltage = db.Column(db.Float, nullable=True)      # Volts
    current = db.Column(db.Float, nullable=True)      # Amps
    power_factor = db.Column(db.Float, nullable=True)
    energy_kwh = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "deviceId": self.device_id,
            "timestamp": self.timestamp.isoformat(),
            "power": self.power,
            "voltage": self.voltage,
            "current": self.current,
            "powerFactor": self.power_factor,
            "energyKwh": self.energy_kwh,
        }
