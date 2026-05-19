import { CheckCircle, AlertTriangle, Info, XOctagon, X } from "lucide-react";
import type { Alert } from "../../shared/types";
import { api } from "../services/api";
import { usePower } from "../context/PowerContext";

const icons = {
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  critical: <XOctagon size={16} />,
};

export default function AlertBox({ alert }: { alert: Alert }) {
  const { refresh } = usePower();

  const resolve = async () => {
    await api.alerts.resolve(alert.id);
    refresh();
  };

  return (
    <div className={`alert-box alert-${alert.type} ${alert.resolved ? "alert-resolved" : ""}`}>
      <span className="alert-icon">{icons[alert.type]}</span>
      <div className="alert-body">
        <div className="alert-msg">{alert.message}</div>
        <div className="alert-time">{new Date(alert.timestamp).toLocaleString()}</div>
      </div>
      {!alert.resolved && (
        <button className="alert-resolve" onClick={resolve} title="Resolve">
          <CheckCircle size={14} />
        </button>
      )}
    </div>
  );
}
