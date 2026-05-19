import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Wifi, WifiOff, X } from "lucide-react";
import { usePower } from "../context/PowerContext";

export default function Navbar() {
  const { alerts, live } = usePower();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("smartPower.seenAlerts") || "[]") as string[]);
    } catch {
      return new Set();
    }
  });
  const [systemStatus, setSystemStatus] = useState<"online" | "offline">(() =>
    localStorage.getItem("smartPower.systemStatus") === "offline" ? "offline" : "online"
  );
  const unreadAlerts = alerts.filter(a => !seenAlertIds.has(a.id));
  const unresolved = unreadAlerts.filter(a => !a.resolved).length;
  const connected = systemStatus === "online";
  const recentAlerts = useMemo(
    () => [...alerts].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 5),
    [alerts]
  );

  useEffect(() => {
    const onStatusChange = (event: Event) => {
      const detail = (event as CustomEvent<"online" | "offline">).detail;
      setSystemStatus(detail === "offline" ? "offline" : "online");
    };

    window.addEventListener("smartPower:systemStatus", onStatusChange);
    return () => window.removeEventListener("smartPower:systemStatus", onStatusChange);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("smartPower.seenAlerts", JSON.stringify([...seenAlertIds]));
    } catch {
      // Ignore storage failures; badge behavior still works in memory.
    }
  }, [seenAlertIds]);

  const openNotifications = () => {
    setSeenAlertIds(current => {
      const next = new Set(current);
      for (const alert of alerts) next.add(alert.id);
      return next;
    });
    setMenuOpen(open => !open);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">⚡</div>
        <div>
          <div className="brand-name">SmartPower</div>
          <div className="brand-sub">Energy Management System</div>
        </div>
      </div>

      <div className="navbar-status">
        {live && (
          <div className="live-pill">
            <span className="live-dot" />
            {(live.totalConsumption / 1000).toFixed(1)} kW
          </div>
        )}
        <div className={`conn-badge ${connected ? "conn-ok" : "conn-err"}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? "Live" : "Offline"}
        </div>
        <div className="notif-wrap" ref={menuRef}>
          <button
            className="icon-btn"
            style={{ position: "relative" }}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label="Notifications"
            onClick={openNotifications}
          >
            <Bell size={18} />
            {unresolved > 0 && <span className="badge">{unresolved}</span>}
          </button>
          {menuOpen && (
            <div className="notif-popover" role="dialog" aria-label="Notifications">
              <div className="notif-head">
                <div>
                  <div className="notif-title">Notifications</div>
                  <div className="notif-sub">{unresolved} unresolved</div>
                </div>
                <button className="icon-btn notif-close" aria-label="Close notifications" onClick={() => setMenuOpen(false)}>
                  <X size={14} />
                </button>
              </div>
              <div className="notif-list">
                {recentAlerts.length === 0 ? (
                  <div className="notif-empty">No notifications right now.</div>
                ) : (
                  recentAlerts.map(alert => (
                    <div key={alert.id} className={`notif-item notif-${alert.type} ${alert.resolved ? "notif-resolved" : ""}`}>
                      <div className="notif-copy">
                        <div className="notif-msg">{alert.message}</div>
                        <div className="notif-time">{new Date(alert.timestamp).toLocaleString()}</div>
                      </div>
                      <span className={`notif-state ${alert.resolved ? "notif-state-resolved" : "notif-state-active"}`}>
                        {alert.resolved ? "Seen" : "New"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="avatar">AD</div>
      </div>
    </header>
  );
}
