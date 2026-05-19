# SmartPower - Energy Management System

<p align="center">
  <img src="./assets/banner.png" alt="SmartPower Banner" width="100%" />
</p>

<p align="center">
  <b>AI-Powered Energy Management and Optimization Platform</b>
</p>

<p align="center">
  Monitor • Analyze • Forecast • Optimize
</p>

---

## Overview

SmartPower is a full-stack real-time power monitoring dashboard with AI-powered forecasting, anomaly detection, live analytics, device monitoring, and optimization recommendations.

The platform helps homes, campuses, and facilities understand consumption, solar generation, net load, energy cost, efficiency, CO2 savings, and active alerts from one dashboard.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Custom CSS dark industrial theme |
| Charts | Recharts |
| Backend | Flask 3 + SQLAlchemy |
| AI | NumPy / scikit-learn style forecasting and Z-score detection |
| Database | SQLite, swappable via `DATABASE_URL` |

## Features

- Real-time energy monitoring
- Solar generation tracking
- Live net load analytics
- Energy cost estimation
- CO2 savings tracking
- AI energy forecasting
- Z-score anomaly detection
- Smart alerts system
- Device status monitoring
- Interactive dashboard charts
- Optimization recommendations
- Daily energy reports

## Project Structure

```text
smart-power-system/
├── src/
│   ├── client/          # React frontend
│   │   ├── components/  # Navbar, Sidebar, PowerCard, ChartCard, AlertBox
│   │   ├── pages/       # Dashboard, Analytics, Devices, Settings
│   │   ├── hooks/       # usePowerData polling hook
│   │   ├── services/    # Typed REST client
│   │   └── context/     # Global power state
│   ├── server/          # Flask backend
│   │   └── app/
│   │       ├── routes/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── models/
│   │       └── ai/
│   ├── shared/          # Shared TypeScript types
│   └── data/            # Mock seed data
├── assets/
├── public/
├── package.json
└── vite.config.ts
```

## Getting Started

Install frontend dependencies:

```bash
npm install
```

Set up the Python backend:

```bash
cd src/server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Configure environment variables:

```bash
cp .env.example .env
```

Run both servers:

```bash
npm run start
```

Or run them separately:

```bash
# Terminal 1
cd src/server && python run.py

# Terminal 2
npm run dev
```

Frontend: `http://localhost:3000`

API: `http://localhost:5000/api`

## API Endpoints

### Power

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/power/summary` | Live KPI totals |
| GET | `/api/power/history` | Hourly chart data |
| GET | `/api/power/live` | Real-time reading |
| GET | `/api/power/predictions?hours=6` | AI forecast |
| GET | `/api/power/anomaly` | Z-score anomaly status |
| GET | `/api/power/recommendations` | AI optimization tips |

### Devices

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/devices/` | All devices |
| GET | `/api/devices/:id` | Single device |
| PATCH | `/api/devices/:id/status` | Update status |

### Alerts

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/alerts/` | All alerts |
| GET | `/api/alerts/?active=true` | Active only |
| POST | `/api/alerts/` | Create alert |
| PATCH | `/api/alerts/:id/resolve` | Resolve alert |

## AI Features

- Power forecasting predicts upcoming energy usage with confidence scores.
- Anomaly detection uses Z-score spike detection on live readings.
- Optimization recommendations flag efficiency, scheduling, and power-factor opportunities.

## Production Notes

- Replace SQLite with PostgreSQL by setting `DATABASE_URL`.
- Set a strong `SECRET_KEY` in `.env`.
- Run Flask with a production WSGI server such as Gunicorn.
- Build the frontend with `npm run build` and serve `dist/` with a web server.
