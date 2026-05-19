import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ChartCard({ title, subtitle, children, actions }: ChartCardProps) {
  return (
    <div className="chart-card">
      <div className="cc-header">
        <div>
          <div className="cc-title">{title}</div>
          {subtitle && <div className="cc-sub">{subtitle}</div>}
        </div>
        {actions && <div className="cc-actions">{actions}</div>}
      </div>
      <div className="cc-body">{children}</div>
    </div>
  );
}
