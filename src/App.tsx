import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EquipmentMapPage from "./components/ui/EquipmentMapPage";
import "./index.css";
import MFAVerificationPage from "./pages/MFAVerification";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import SensorStatusPage from "./pages/SensorStatusPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/equipment-map" element={<EquipmentMapPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/sensors" element={<SensorStatusPage />} />
          <Route path="/mfa" element={<MFAVerificationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/technician" element={<div>Technician Tools</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}
