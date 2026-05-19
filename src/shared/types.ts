export type DeviceStatus = "active" | "idle" | "warning" | "maintenance" | "off";
export type DeviceType = "hvac" | "server" | "lighting" | "ev_charger" | "solar" | "compressor" | "generic";
export type AlertType = "info" | "warning" | "critical";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  power: number;       // Watts (negative = generation)
  voltage: number;     // Volts
  current: number;     // Amps
  powerFactor: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PowerReading {
  timestamp: string;
  totalConsumption: number;
  totalGeneration: number;
  frequency: number;
  gridVoltage: number;
}

export interface PowerHistory {
  time: string;
  consumption: number;
  generation: number;
  cost: number;
}

export interface PowerSummary {
  totalConsumption: number;
  totalGeneration: number;
  netLoad: number;
  dailyCost: number;
  efficiency: number;
  co2Saved: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  device: string | null;
  timestamp: string;
  resolved: boolean;
}

export interface Prediction {
  time: string;
  timestamp: string;
  predicted: number;
  confidence: number;
}

export interface AnomalyStatus {
  anomaly: boolean;
  score: number;
  threshold: number;
  latestValue: number;
  mean: number;
}

export interface Recommendation {
  deviceId: string | null;
  deviceName: string;
  type: string;
  priority: "low" | "medium" | "high";
  message: string;
  estimatedSaving: number;
}
