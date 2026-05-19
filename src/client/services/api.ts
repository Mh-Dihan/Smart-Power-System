const BASE = import.meta.env.VITE_API_URL || "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

async function patch<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

async function put<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  health: () => get("/health"),
  power: {
    summary: () => get("/power/summary"),
    history: () => get("/power/history"),
    live: () => get("/power/live"),
    predictions: (hours = 6) => get(`/power/predictions?hours=${hours}`),
    anomaly: () => get("/power/anomaly"),
    recommendations: () => get("/power/recommendations"),
  },
  devices: {
    list: () => get("/devices/"),
    get: (id: string) => get(`/devices/${id}`),
    setStatus: (id: string, status: string) => patch(`/devices/${id}/status`, { status }),
  },
  alerts: {
    list: (activeOnly = false) => get(`/alerts/?active=${activeOnly}`),
    resolve: (id: string) => patch(`/alerts/${id}/resolve`, {}),
  },
  settings: {
    get: () => get("/settings"),
    save: (settings: object) => put("/settings", settings),
  },
};
