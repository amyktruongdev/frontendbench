import { authFetch } from "../utils/authFetch";
import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";

export default function SensorStatusPage() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await authFetch(
          `${process.env.REACT_APP_DOMAIN_NAME}api/sensors/info`
        );
        const data = await response.json();
        setSensors(data);
      } catch (error) {
        console.error("Failed to fetch sensor status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, []);

  return (
    <main
      className="w-full max-w-4xl mx-auto"
      role="main"
      aria-label="Sensor Status Page"
    >
      <Card className="w-full max-w-4xl mx-auto border-red-300">
        <CardContent 
          className="p-6"
          role="region"
          aria-labelledby="sensor-status-heading"
        >
          <h2 id="sensor-status-heading" className="text-2xl font-semibold text-center text-red-600 mb-4">
            Sensor Status Overview
          </h2>
          {loading ? (
            <p
              className="text-center text-gray-600"
              role="status"
              aria-live="polite"
            >
              Loading...
            </p>
          ) : sensors.length > 0 ? (
            <ul className="space-y-3" aria-label="List of sensor statuses">
              {sensors.map((sensor) => (
                <li
                  key={sensor.sensorId}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center"
                  role="group"
                  aria-label={`Sensor ${sensor.sensorId}, equipment ${sensor.equipmentId}`}
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      Sensor #{sensor.sensorId} (Equipment {sensor.equipmentId})
                    </div>
                    <div className="text-sm text-gray-500">
                      Last Ping:{" "}
                      {sensor.lastPing
                        ? new Date(sensor.lastPing).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                  <div
                    className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                    aria-label={`Type: ${sensor.type}, Battery: ${sensor.batteryLevel}%`}
                  >
                    {sensor.type} | Battery: {sensor.batteryLevel}%
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="text-center text-gray-600"
              role="status"
              aria-live="polite"
            >
              No sensor data found.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
