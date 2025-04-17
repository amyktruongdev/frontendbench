import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import EquipmentUsageCards from "../components/dashboard/EquipmentUsageCards";
import DashboardFooter from "../components/dashboard/DashboardFooter";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_DOMAIN_NAME + "api/dashboard/summary"
        );
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const usageRate = summary?.usageRate || 0;
  let statusBanner = null;

  if (usageRate >= 75) {
    statusBanner = (
      <div className="mt-6 w-full bg-red-600 text-white font-bold text-center text-xl py-3 rounded-lg shadow-lg animate-pulse ring-2 ring-red-300">
        🔥 GYM IS EXTREMELY BUSY 🔥
      </div>
    );
  } else if (usageRate >= 65) {
    statusBanner = (
      <div className="mt-6 w-full bg-yellow-400 text-black font-bold text-center text-xl py-3 rounded-lg shadow-md ring-2 ring-yellow-300">
        Gym is Moderately Busy
      </div>
    );
  } else {
    statusBanner = (
      <div className="mt-6 w-full bg-green-200 text-green-900 font-bold text-center text-xl py-3 rounded-lg shadow-sm ring-2 ring-green-300">
        ✅ Gym is Not Busy
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-extrabold text-red-500 tracking-wider mb-1 drop-shadow">
          OpenBench
        </h1>
        <p className="text-gray-600 text-lg">
          {currentTime.toLocaleDateString()} •{" "}
          {currentTime.toLocaleTimeString()}
        </p>
      </div>
      <Card className="border-red-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">
            Dashboard Overview
          </h2>
          {loading || !summary ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="text-center space-y-2">
              <p>🏋️‍♂️ Equipment Count: {summary.equipmentCount}</p>
              {statusBanner}
            </div>
          )}
        </CardContent>
      </Card>
      {summary?.equipmentUsage && (
        <EquipmentUsageCards usage={summary.equipmentUsage} />
      )}
      <DashboardFooter />
    </div>
  );
}
