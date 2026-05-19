import type { ReactNode } from "react";

interface PowerCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  accent?: "green" | "blue" | "amber" | "red" | "purple";
}

export default function PowerCard({ title, value, unit, subtitle, icon, trend, accent = "blue" }: PowerCardProps) {
  return (
    <div className={`power-card accent-${accent}`}>
      <div className="pc-header">
        <span className="pc-title">{title}</span>
        <span className={`pc-icon accent-${accent}`}>{icon}</span>
      </div>
      <div className="pc-value">
        {value}
        {unit && <span className="pc-unit">{unit}</span>}
      </div>
      <div className="pc-footer">
        {subtitle && <span className="pc-sub">{subtitle}</span>}
        {trend !== undefined && (
          <span className={`pc-trend ${trend >= 0 ? "trend-up" : "trend-down"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
