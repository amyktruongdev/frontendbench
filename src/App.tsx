import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import EquipmentMapPage from "./components/ui/EquipmentMapPage";
import VerificationPage from "./pages/VerificationPage";
import "./index.css";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import RegistrationPage from "./pages/RegistrationPage";
import SensorStatusPage from "./pages/SensorStatusPage";
import MFAVerificationPage from "./pages/MFAVerififcation";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerificationPage />} />
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
