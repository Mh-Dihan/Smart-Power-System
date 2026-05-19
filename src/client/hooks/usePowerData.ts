import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import type {
  PowerSummary, PowerHistory, PowerReading,
  Device, Alert, Prediction, AnomalyStatus, Recommendation
} from "../../shared/types";
import {
  fallbackAlerts,
  fallbackDevices,
  fallbackHistory,
  fallbackSummary,
} from "../data/fallbackData";

export function usePowerData(refreshInterval = 5000) {
  const [summary, setSummary] = useState<PowerSummary | null>(fallbackSummary);
  const [history, setHistory] = useState<PowerHistory[]>(fallbackHistory);
  const [live, setLive] = useState<PowerReading | null>(null);
  const [devices, setDevices] = useState<Device[]>(fallbackDevices);
  const [alerts, setAlerts] = useState<Alert[]>(fallbackAlerts);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomaly, setAnomaly] = useState<AnomalyStatus | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currency, setCurrency] = useState<string>(() => localStorage.getItem("smartPower.currency") || "USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.power.summary() as Promise<PowerSummary>,
        api.power.history() as Promise<PowerHistory[]>,
        api.power.live() as Promise<PowerReading>,
        api.devices.list() as Promise<Device[]>,
        api.alerts.list() as Promise<Alert[]>,
        api.power.predictions() as Promise<Prediction[]>,
        api.power.anomaly() as Promise<AnomalyStatus>,
        api.power.recommendations() as Promise<Recommendation[]>,
        api.settings.get() as Promise<{ currency?: string }>,
      ]);

      const [s, h, l, d, a, p, an, r, settings] = results;

      if (s.status === "fulfilled") setSummary(s.value);
      else setSummary(current => current ?? fallbackSummary);
      if (h.status === "fulfilled") setHistory(h.value);
      else setHistory(current => current.length ? current : fallbackHistory);
      if (l.status === "fulfilled") setLive(l.value);
      if (d.status === "fulfilled") setDevices(d.value);
      else setDevices(current => current.length ? current : fallbackDevices);
      if (a.status === "fulfilled") setAlerts(a.value);
      else setAlerts(current => current.length ? current : fallbackAlerts);
      if (p.status === "fulfilled") setPredictions(p.value);
      if (an.status === "fulfilled") setAnomaly(an.value);
      if (r.status === "fulfilled") setRecommendations(r.value);
      if (settings.status === "fulfilled" && settings.value.currency) {
        setCurrency(settings.value.currency);
        localStorage.setItem("smartPower.currency", settings.value.currency);
      }

      const failed = results.find(result => result.status === "rejected");
      setError(failed && failed.status === "rejected" ? failed.reason.message : null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onCurrencyChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail) {
        setCurrency(detail);
        localStorage.setItem("smartPower.currency", detail);
      }
    };

    window.addEventListener("smartPower:currencyChanged", onCurrencyChange);
    fetchAll();
    const id = setInterval(fetchAll, refreshInterval);
    return () => {
      clearInterval(id);
      window.removeEventListener("smartPower:currencyChanged", onCurrencyChange);
    };
  }, [fetchAll, refreshInterval]);

  return { summary, history, live, devices, alerts, predictions, anomaly, recommendations, currency, loading, error, refresh: fetchAll };
}
