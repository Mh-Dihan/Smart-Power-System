import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PowerProvider } from "./context/PowerContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import Settings from "./pages/Settings";
import "./app.css";

export default function App() {
  return (
    <PowerProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <div className="app-body">
            <Sidebar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </PowerProvider>
  );
}
