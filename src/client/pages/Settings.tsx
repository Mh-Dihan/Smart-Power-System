import { useEffect, useState } from "react";
import { api } from "../services/api";

type SaveStatus = "idle" | "loading" | "saving" | "saved" | "failed";
type SystemStatus = "online" | "offline";

type SettingsForm = {
  refreshInterval: string;
  alertThreshold: string;
  peakStart: string;
  peakEnd: string;
  currency: string;
  tariffRate: string;
  notifications: boolean;
  darkMode: boolean;
  systemStatus: SystemStatus;
};

const defaultSettings: SettingsForm = {
  refreshInterval: "5",
  alertThreshold: "2.5",
  peakStart: "18",
  peakEnd: "22",
  currency: "USD",
  tariffRate: "0.15",
  notifications: true,
  darkMode: true,
  systemStatus: "online",
};

function applyDarkMode(enabled: boolean) {
  document.documentElement.dataset.theme = enabled ? "dark" : "light";
  localStorage.setItem("smartPower.darkMode", String(enabled));
}

function applySystemStatus(status: SystemStatus) {
  localStorage.setItem("smartPower.systemStatus", status);
  window.dispatchEvent(new CustomEvent("smartPower:systemStatus", { detail: status }));
}

function applyCurrency(currency: string) {
  localStorage.setItem("smartPower.currency", currency);
  window.dispatchEvent(new CustomEvent("smartPower:currencyChanged", { detail: currency }));
}

export default function Settings() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [message, setMessage] = useState("Loading settings...");
  const [form, setForm] = useState<SettingsForm>(() => {
    const storedTheme = localStorage.getItem("smartPower.darkMode");
    const storedStatus = localStorage.getItem("smartPower.systemStatus") as SystemStatus | null;
    const storedCurrency = localStorage.getItem("smartPower.currency") || defaultSettings.currency;

    return {
      ...defaultSettings,
      darkMode: storedTheme === null ? defaultSettings.darkMode : storedTheme === "true",
      systemStatus: storedStatus === "offline" ? "offline" : "online",
      currency: storedCurrency,
    };
  });

  const handleChange = (key: keyof SettingsForm, value: SettingsForm[keyof SettingsForm]) =>
    setForm(current => ({ ...current, [key]: value }));

  const toggleNotifications = () => {
    const nextEnabled = !form.notifications;
    handleChange("notifications", nextEnabled);
    setMessage(nextEnabled ? "Notifications enabled. Save to keep this setting." : "Notifications disabled. Save to keep this setting.");
  };

  const toggleDarkMode = () => {
    const nextEnabled = !form.darkMode;
    applyDarkMode(nextEnabled);
    handleChange("darkMode", nextEnabled);
    setMessage(nextEnabled ? "Dark mode enabled. Save to keep this setting." : "Light mode enabled. Save to keep this setting.");
  };

  const setManualStatus = (status: SystemStatus) => {
    applySystemStatus(status);
    handleChange("systemStatus", status);
    setMessage(`System status set to ${status}. Save to keep this setting.`);
  };

  useEffect(() => {
    applyDarkMode(form.darkMode);
    applySystemStatus(form.systemStatus);
    applyCurrency(form.currency);

    let active = true;

    async function loadSettings() {
      try {
        const settings = await api.settings.get() as Partial<SettingsForm>;
        if (!active) return;
        const nextSettings = { ...defaultSettings, ...settings };
        setForm(nextSettings);
        applyDarkMode(nextSettings.darkMode);
        applySystemStatus(nextSettings.systemStatus);
        applyCurrency(nextSettings.currency);
        setSaveStatus("idle");
        setMessage("Settings loaded from backend.");
      } catch {
        if (!active) return;
        setSaveStatus("failed");
        setMessage("Backend is not responding. Your local choices still work on this screen.");
      }
    }

    loadSettings();
    return () => { active = false; };
  }, []);

  const save = async () => {
    try {
      setSaveStatus("saving");
      setMessage("Saving settings...");
      const settings = await api.settings.save(form) as Partial<SettingsForm>;
      const nextSettings = { ...form, ...settings };
      setForm(nextSettings);
      applyDarkMode(nextSettings.darkMode);
      applySystemStatus(nextSettings.systemStatus);
      applyCurrency(nextSettings.currency);
      setSaveStatus("saved");
      setMessage("Settings saved successfully.");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("failed");
      setMessage("Save failed. Check that the backend is running.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>System configuration & preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h3>Monitoring</h3>
          <div className="field-group">
            <label>Data Refresh Interval (seconds)</label>
            <input type="number" value={form.refreshInterval} min={1} max={60}
              onChange={e => handleChange("refreshInterval", e.target.value)} />
          </div>
          <div className="field-group">
            <label>Anomaly Z-Score Threshold</label>
            <input type="number" value={form.alertThreshold} step={0.1} min={1} max={5}
              onChange={e => handleChange("alertThreshold", e.target.value)} />
          </div>
          <div className="field-group toggle-field">
            <label>Push Notifications</label>
            <div
              className={`toggle ${form.notifications ? "toggle-on" : ""}`}
              role="switch"
              aria-checked={form.notifications}
              tabIndex={0}
              onClick={toggleNotifications}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleNotifications();
                }
              }}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Tariff & Cost</h3>
          <div className="field-group">
            <label>Currency</label>
            <select value={form.currency} onChange={e => handleChange("currency", e.target.value)}>
              <option>USD</option><option>EUR</option><option>GBP</option><option>BDT</option>
            </select>
          </div>
          <div className="field-group">
            <label>Base Tariff Rate (per kWh)</label>
            <input type="number" value={form.tariffRate} step={0.01} min={0}
              onChange={e => handleChange("tariffRate", e.target.value)} />
          </div>
          <div className="field-group">
            <label>Peak Hours Start (24h)</label>
            <input type="number" value={form.peakStart} min={0} max={23}
              onChange={e => handleChange("peakStart", e.target.value)} />
          </div>
          <div className="field-group">
            <label>Peak Hours End (24h)</label>
            <input type="number" value={form.peakEnd} min={0} max={23}
              onChange={e => handleChange("peakEnd", e.target.value)} />
          </div>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="field-group toggle-field">
            <label>Dark Mode</label>
            <div
              className={`toggle ${form.darkMode ? "toggle-on" : ""}`}
              role="switch"
              aria-checked={form.darkMode}
              tabIndex={0}
              onClick={toggleDarkMode}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleDarkMode();
                }
              }}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>System Status</h3>
          <div className="field-group">
            <label>Online / Offline</label>
            <select value={form.systemStatus} onChange={e => setManualStatus(e.target.value as SystemStatus)}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="field-group">
            <label>Current Status</label>
            <div className={`api-status api-status-${form.systemStatus}`}><span className="sys-dot" /> {form.systemStatus}</div>
          </div>
          <div className="settings-response">{message}</div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-primary" onClick={save} disabled={saveStatus === "saving"}>
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
