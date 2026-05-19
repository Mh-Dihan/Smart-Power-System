from .. import db
from datetime import datetime

class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="active")
    location = db.Column(db.String(100))
    power = db.Column(db.Float, default=0)
    voltage = db.Column(db.Float, default=220)
    current = db.Column(db.Float, default=0)
    power_factor = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "status": self.status,
            "location": self.location,
            "power": self.power,
            "voltage": self.voltage,
            "current": self.current,
            "powerFactor": self.power_factor,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
        }
