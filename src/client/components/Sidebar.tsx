import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart2, Cpu, Settings } from "lucide-react";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/devices", icon: Cpu, label: "Devices" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "nav-active" : ""}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sys-health">
          <div className="sys-dot" />
          <span>System Healthy</span>
        </div>
      </div>
    </aside>
  );
}
