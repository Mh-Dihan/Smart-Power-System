import { useState } from "react";
import { Zap, Thermometer, Server, Lightbulb, Car, Sun, Wind } from "lucide-react";
import { usePower } from "../context/PowerContext";
import { api } from "../services/api";
import type { Device } from "../../shared/types";

const typeIcons: Record<string, any> = {
  hvac: Thermometer, server: Server, lighting: Lightbulb,
  ev_charger: Car, solar: Sun, compressor: Wind,
};

const statusColors: Record<string, string> = {
  active: "#10b981", idle: "#64748b", warning: "#f59e0b",
  maintenance: "#3b82f6", off: "#ef4444",
};

export default function Devices() {
  const { devices, loading, refresh } = usePower();
  const [selected, setSelected] = useState<Device | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (id: string, status: string) => {
    setUpdating(true);
    try { await api.devices.setStatus(id, status); refresh(); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading devices…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Devices</h1>
        <p>{devices.length} monitored endpoints</p>
      </div>

      <div className="devices-grid">
        {devices.map(d => {
          const Icon = typeIcons[d.type] || Zap;
          const isGen = d.power < 0;
          return (
            <div
              key={d.id}
              className={`device-card ${selected?.id === d.id ? "device-selected" : ""}`}
              onClick={() => setSelected(d)}
            >
              <div className="device-top">
                <div className="device-icon-wrap" style={{ background: `${statusColors[d.status]}22` }}>
                  <Icon size={22} color={statusColors[d.status]} />
                </div>
                <span className="device-status-dot" style={{ background: statusColors[d.status] }} />
              </div>
              <div className="device-name">{d.name}</div>
              <div className="device-loc">{d.location}</div>
              <div className="device-power" style={{ color: isGen ? "#10b981" : "#f59e0b" }}>
                {isGen ? "+" : ""}{(Math.abs(d.power) / 1000).toFixed(2)} kW
              </div>
              <div className="device-meta">
                <span>PF {d.powerFactor.toFixed(2)}</span>
                <span>{d.voltage}V</span>
                <span className={`device-badge badge-${d.status}`}>{d.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="detail-panel">
          <div className="detail-header">
            <h2>{selected.name}</h2>
            <button className="icon-btn" onClick={() => setSelected(null)}>✕</button>
          </div>
          <div className="detail-grid">
            {[
              ["Type", selected.type],
              ["Location", selected.location],
              ["Status", selected.status],
              ["Power", `${(Math.abs(selected.power)/1000).toFixed(3)} kW`],
              ["Voltage", `${selected.voltage} V`],
              ["Current", `${selected.current} A`],
              ["Power Factor", selected.powerFactor.toFixed(3)],
              ["Apparent Power", `${((selected.voltage * selected.current)/1000).toFixed(3)} kVA`],
            ].map(([k, v]) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k}</span>
                <span className="detail-val">{v}</span>
              </div>
            ))}
          </div>
          <div className="detail-actions">
            {["active", "idle", "maintenance", "off"].map(s => (
              <button
                key={s}
                className={`status-btn ${selected.status === s ? "status-btn-active" : ""}`}
                disabled={updating}
                onClick={() => handleStatus(selected.id, s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
