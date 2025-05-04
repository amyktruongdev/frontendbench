import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import EquipmentUsageCards from "../components/dashboard/EquipmentUsageCards";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { authFetch } from "../utils/authFetch";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL as string, {
  transports: ["websocket"],
});

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch dashboard summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}api/dashboard/summary`);
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

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time status updates
  useEffect(() => {
    socket.on("statusUpdate", (data) => {
      console.log("📡 Real-time status update:", data);

      setSummary((prevSummary: any) => {
        if (!prevSummary || !prevSummary.equipmentUsage) return prevSummary;

        const updatedEquipmentUsage = prevSummary.equipmentUsage.map((equipment: any) => {
          if (equipment.equipmentId === data.equipmentId) {
            if (equipment.inUse !== data.inUse) {
              const message = data.inUse
                ? `${equipment.name} is now IN USE`
                : `${equipment.name} is now AVAILABLE`;
              setToastMessage(message);
              setTimeout(() => setToastMessage(null), 3000);
            }

            return {
              ...equipment,
              inUse: data.inUse,
              lastUpdated: data.timestamp,
            };
          }
          return equipment;
        });

        return {
          ...prevSummary,
          equipmentUsage: updatedEquipmentUsage,
        };
      });
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  // Determine usage rate
  const usageRate =
  summary?.usageRate ??
  (summary?.equipmentUsage
    ? Math.round(
        (summary.equipmentUsage.reduce(
          (acc: number, eq: any) => acc + eq.in_use,
          0
        ) /
          summary.equipmentUsage.reduce(
            (acc: number, eq: any) => acc + eq.total,
            0
          )) *
          100
      )
    : 0);
    
  // Display banner based on usage
  let statusBanner = null;
  if (usageRate >= 75) {
    statusBanner = (
      <div className="mt-6 w-full bg-red-600 text-white font-bold text-center text-lg sm:text-xl py-3 rounded-lg shadow-lg animate-pulse ring-2 ring-red-300">
        🔥 GYM IS EXTREMELY BUSY 🔥
      </div>
    );
  } else if (usageRate >= 65) {
    statusBanner = (
      <div className="mt-6 w-full bg-yellow-400 text-black font-bold text-center text-lg sm:text-xl py-3 rounded-lg shadow-md ring-2 ring-yellow-300">
        Gym is Moderately Busy
      </div>
    );
  } else {
    statusBanner = (
      <div className="mt-6 w-full bg-green-200 text-green-900 font-bold text-center text-lg sm:text-xl py-3 rounded-lg shadow-sm ring-2 ring-green-300">
        ✅ Gym is Not Busy
      </div>
    );
  }

  return (
    <>
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-black text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          {toastMessage}
        </div>
      )}

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Dashboard Main Content"
      >
        <header className="text-center mb-6" role="banner">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-red-500 tracking-wider mb-1 drop-shadow">
            OpenBench
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg" aria-live="polite"
        aria-atomic="true">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </header>

        <section
          role="region"
          aria-label="Dashboard Overview"
          className="mb-6"
        >
          <Card className="border-red-300">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-center text-red-600 mb-4">
                Dashboard Overview
              </h2>
              {loading || !summary ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-base sm:text-lg">🏋️‍♂️ Equipment Count: {summary.equipmentCount}</p>
                  {statusBanner}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {summary?.equipmentUsage && (
          <section role="region" aria-label="Equipment Usage Statistics">
            <div className="mt-6">
              <EquipmentUsageCards usage={summary.equipmentUsage} />
            </div>
          </section>
        )}

        <footer role="contentinfo" className="mt-6">
          <DashboardFooter />
        </footer>
      </main>
    </>
  );
}
