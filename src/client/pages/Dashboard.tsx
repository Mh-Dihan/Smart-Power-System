import { Zap, Sun, TrendingDown, DollarSign, Leaf, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import PowerCard from "../components/PowerCard";
import ChartCard from "../components/ChartCard";
import AlertBox from "../components/AlertBox";
import { usePower } from "../context/PowerContext";
import { formatMoney } from "../utils/formatMoney";

export default function Dashboard() {
  const { summary, history, alerts, anomaly, recommendations, currency, loading } = usePower();

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Initializing systems…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time power overview</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <PowerCard
          title="Total Consumption"
          value={summary ? (summary.totalConsumption / 1000).toFixed(1) : "—"}
          unit=" kW"
          icon={<Zap size={20} />}
          accent="blue"
          subtitle="Grid draw right now"
          trend={2.4}
        />
        <PowerCard
          title="Solar Generation"
          value={summary ? (summary.totalGeneration / 1000).toFixed(1) : "—"}
          unit=" kW"
          icon={<Sun size={20} />}
          accent="amber"
          subtitle="Rooftop PV output"
          trend={8.1}
        />
        <PowerCard
          title="Net Load"
          value={summary ? (summary.netLoad / 1000).toFixed(1) : "—"}
          unit=" kW"
          icon={<TrendingDown size={20} />}
          accent="purple"
          subtitle="Consumption minus generation"
          trend={-3.2}
        />
        <PowerCard
          title="Daily Cost"
          value={summary ? formatMoney(summary.dailyCost, currency) : "—"}
          icon={<DollarSign size={20} />}
          accent="green"
          subtitle="Estimated today"
          trend={-1.8}
        />
        <PowerCard
          title="Efficiency"
          value={summary ? summary.efficiency.toFixed(1) : "—"}
          unit="%"
          icon={<Activity size={20} />}
          accent="blue"
          subtitle="System efficiency score"
        />
        <PowerCard
          title="CO₂ Saved"
          value={summary ? summary.co2Saved.toFixed(1) : "—"}
          unit=" t"
          icon={<Leaf size={20} />}
          accent="green"
          subtitle="vs. grid baseline today"
          trend={12.3}
        />
      </div>

      {/* Main Chart */}
      <div className="grid-2-1">
        <ChartCard title="Power Flow" subtitle="Consumption vs Generation (kW) — today">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gGen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v: number, name: string) => [`${(v/1000).toFixed(2)} kW`, name]}
              />
              <Legend />
              <Area type="monotone" dataKey="consumption" name="Consumption" stroke="#3b82f6" fill="url(#gCons)" strokeWidth={2} />
              <Area type="monotone" dataKey="generation" name="Generation" stroke="#f59e0b" fill="url(#gGen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Alerts Panel */}
        <ChartCard title="Active Alerts" subtitle={`${alerts.filter(a => !a.resolved).length} unresolved`}>
          <div className="alerts-list">
            {alerts.length === 0
              ? <p className="empty-msg">No alerts</p>
              : alerts.map(a => <AlertBox key={a.id} alert={a} />)
            }
          </div>
        </ChartCard>
      </div>

      {/* Anomaly + Recommendations */}
      <div className="grid-2-1">
        <ChartCard title="AI Recommendations" subtitle="Optimization suggestions">
          <div className="rec-list">
            {recommendations.map((r, i) => (
              <div key={i} className={`rec-item rec-${r.priority}`}>
                <div className="rec-badge">{r.priority}</div>
                <div className="rec-body">
                  <div className="rec-device">{r.deviceName}</div>
                  <div className="rec-msg">{r.message}</div>
                  {r.estimatedSaving > 0 && (
                    <div className="rec-saving">Est. saving: {r.estimatedSaving.toFixed(0)} W</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {anomaly && (
          <ChartCard title="Anomaly Detection" subtitle="AI Z-score monitor">
            <div className={`anomaly-panel ${anomaly.anomaly ? "anomaly-alert" : "anomaly-ok"}`}>
              <div className="anomaly-status">{anomaly.anomaly ? "⚠ ANOMALY DETECTED" : "✓ Normal"}</div>
              <div className="anomaly-score">Z-score: <strong>{anomaly.score.toFixed(3)}</strong></div>
              <div className="anomaly-detail">Threshold: {anomaly.threshold} | Mean: {(anomaly.mean/1000).toFixed(2)} kW</div>
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
