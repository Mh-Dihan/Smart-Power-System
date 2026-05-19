import type { Alert, Device, PowerHistory, PowerSummary } from "../../shared/types";

export const fallbackDevices: Device[] = [
  { id: "d1", name: "HVAC Unit", type: "hvac", status: "active", location: "Floor 1", power: 3200, voltage: 220, current: 14.5, powerFactor: 0.92 },
  { id: "d2", name: "Server Room", type: "server", status: "active", location: "Basement", power: 8500, voltage: 220, current: 38.6, powerFactor: 0.98 },
  { id: "d3", name: "Lighting Grid A", type: "lighting", status: "active", location: "Floor 2", power: 1200, voltage: 220, current: 5.4, powerFactor: 0.85 },
  { id: "d4", name: "EV Charger Bay", type: "ev_charger", status: "idle", location: "Parking", power: 0, voltage: 220, current: 0, powerFactor: 1 },
  { id: "d5", name: "Solar Inverter", type: "solar", status: "active", location: "Rooftop", power: -4500, voltage: 220, current: 20.4, powerFactor: 0.99 },
  { id: "d6", name: "Compressor Unit", type: "compressor", status: "warning", location: "Floor 3", power: 2100, voltage: 220, current: 9.5, powerFactor: 0.78 },
];

export const fallbackHistory: PowerHistory[] = [
  { time: "00:00", consumption: 12400, generation: 0, cost: 1.86 },
  { time: "02:00", consumption: 9800, generation: 0, cost: 1.47 },
  { time: "04:00", consumption: 8200, generation: 0, cost: 1.23 },
  { time: "06:00", consumption: 10500, generation: 800, cost: 1.45 },
  { time: "08:00", consumption: 14800, generation: 2400, cost: 1.86 },
  { time: "10:00", consumption: 18200, generation: 4200, cost: 2.1 },
  { time: "12:00", consumption: 19500, generation: 5100, cost: 2.16 },
  { time: "14:00", consumption: 20100, generation: 4800, cost: 2.3 },
  { time: "16:00", consumption: 18700, generation: 3600, cost: 2.26 },
  { time: "18:00", consumption: 21200, generation: 1200, cost: 3 },
  { time: "20:00", consumption: 17800, generation: 0, cost: 2.67 },
  { time: "22:00", consumption: 14200, generation: 0, cost: 2.13 },
];

export const fallbackAlerts: Alert[] = [
  { id: "a1", type: "warning", message: "Compressor Unit power factor below threshold (0.78)", device: "d6", timestamp: "2024-01-15T14:32:00Z", resolved: false },
  { id: "a3", type: "critical", message: "Server Room consumption spike detected (+22%)", device: "d2", timestamp: "2024-01-15T09:15:00Z", resolved: false },
];

export const fallbackSummary: PowerSummary = {
  totalConsumption: 14200,
  totalGeneration: 4500,
  netLoad: 9700,
  dailyCost: 42.8,
  efficiency: 87.3,
  co2Saved: 2.1,
};
