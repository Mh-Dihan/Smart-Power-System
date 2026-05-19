import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import ChartCard from "../components/ChartCard";
import { usePower } from "../context/PowerContext";
import { formatMoney } from "../utils/formatMoney";

export default function Analytics() {
  const { history, predictions, currency, loading } = usePower();

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading analytics…</p></div>;

  const costData = history.map(h => ({ ...h, cost: h.cost }));

  // Merge history tail + predictions for forecast chart
  const lastHistoryPoint = history[history.length - 1];
  const forecastData = [
    ...history.slice(-4).map(h => ({ time: h.time, actual: h.consumption / 1000, predicted: null })),
    ...predictions.map(p => ({ time: p.time, actual: null, predicted: p.predicted / 1000, confidence: p.confidence })),
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Trends, forecasting & cost analysis</p>
      </div>

      <div className="grid-2">
        <ChartCard title="Consumption vs Generation" subtitle="Hourly breakdown — today (kW)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v: number, name: string) => [`${(v/1000).toFixed(2)} kW`, name]}
              />
              <Legend />
              <Bar dataKey="consumption" name="Consumption" fill="#3b82f6" radius={[3,3,0,0]} />
              <Bar dataKey="generation" name="Generation" fill="#f59e0b" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Electricity Cost" subtitle={`Hourly cost estimate (${currency})`}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={costData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v: number) => [formatMoney(v, currency), "Cost"]}
              />
              <Area type="monotone" dataKey="cost" name="Cost" stroke="#a855f7" fill="url(#gCost)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="AI Power Forecast" subtitle="Next 6 hours vs recent actuals (kW)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              formatter={(v, name) => typeof v === "number" ? [`${v.toFixed(2)} kW`, name] : ["-", name]}
            />
            <Legend />
            <ReferenceLine x={lastHistoryPoint?.time} stroke="#475569" strokeDasharray="4 4" label={{ value: "Now", fill: "#94a3b8", fontSize: 11 }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls={false} />
            <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#10b981" }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Prediction confidence table */}
      <ChartCard title="Forecast Details" subtitle="AI predictions with confidence scores">
        <table className="data-table">
          <thead>
            <tr><th>Time</th><th>Predicted</th><th>Confidence</th><th>Estimated Cost</th></tr>
          </thead>
          <tbody>
            {predictions.map((p, i) => (
              <tr key={i}>
                <td>{p.time}</td>
                <td>{(p.predicted / 1000).toFixed(2)} kW</td>
                <td>
                  <div className="conf-bar-wrap">
                    <div className="conf-bar" style={{ width: `${p.confidence * 100}%` }} />
                    <span>{(p.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>{formatMoney(p.predicted * 0.00015, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartCard>
    </div>
  );
}
