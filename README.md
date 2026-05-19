# ⚡ SmartPower — Energy Management System

A full-stack real-time power monitoring dashboard with AI-powered forecasting and anomaly detection.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Custom CSS (dark industrial theme) |
| Charts | Recharts |
| Backend | Flask 3 + SQLAlchemy |
| AI | NumPy / scikit-learn (Z-score + linear regression) |
| Database | SQLite (swappable via `DATABASE_URL`) |

---

## Project Structure

```
smart-power-system/
├── src/
│   ├── client/          # React frontend
│   │   ├── components/  # Navbar, Sidebar, PowerCard, ChartCard, AlertBox
│   │   ├── pages/       # Dashboard, Analytics, Devices, Settings
│   │   ├── hooks/       # usePowerData (polling hook)
│   │   ├── services/    # api.ts (typed REST client)
│   │   └── context/     # PowerContext (global state)
│   ├── server/          # Flask backend
│   │   └── app/
│   │       ├── routes/      # Blueprints: power, devices, alerts
│   │       ├── controllers/ # Request handlers
│   │       ├── services/    # Business logic
│   │       ├── models/      # SQLAlchemy models
│   │       └── ai/          # Predictor + anomaly detector
│   ├── shared/          # Shared TypeScript types
│   └── data/            # powerData.json (mock seed data)
├── public/
├── .env
├── package.json
└── vite.config.ts
```

---

## Getting Started

### 1. Clone & install frontend deps
```bash
npm install
```

### 2. Set up Python backend
```bash
cd src/server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env as needed
```

### 4. Run both servers

**Option A — together (requires concurrently):**
```bash
npm run start
```

**Option B — separately:**
```bash
# Terminal 1 — Flask API
cd src/server && python run.py

# Terminal 2 — Vite dev server
npm run dev
```

Frontend: http://localhost:3000  
API: http://localhost:5000/api

---

## API Endpoints

### Power
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/power/summary` | Live KPI totals |
| GET | `/api/power/history` | Hourly chart data |
| GET | `/api/power/live` | Real-time reading |
| GET | `/api/power/predictions?hours=6` | AI forecast |
| GET | `/api/power/anomaly` | Z-score anomaly status |
| GET | `/api/power/recommendations` | AI optimization tips |

### Devices
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/devices/` | All devices |
| GET | `/api/devices/:id` | Single device |
| PATCH | `/api/devices/:id/status` | Update status |

### Alerts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/alerts/` | All alerts |
| GET | `/api/alerts/?active=true` | Active only |
| POST | `/api/alerts/` | Create alert |
| PATCH | `/api/alerts/:id/resolve` | Resolve alert |

---

## AI Features

- **Power Forecasting** — Sinusoidal + regression model predicts next 6 hours with confidence scores
- **Anomaly Detection** — Z-score based spike detection on live readings (threshold: 2.5σ)
- **Optimization Recommendations** — Rule-based engine flags low power factor, idle scheduling opportunities

---

## Production Notes

- Replace `sqlite:///` with PostgreSQL via `DATABASE_URL`
- Set a strong `SECRET_KEY` in `.env`
- Run Flask with `gunicorn`: `gunicorn -w 4 run:app`
- Build frontend: `npm run build` → serve `dist/` via nginx
