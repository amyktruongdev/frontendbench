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
          `${process.env.REACT_APP_DOMAIN_NAME}api/sensors/status`
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
    <Card className="w-full max-w-4xl mx-auto border-red-300">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">
          Sensor Status Overview
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : sensors.length > 0 ? (
          <ul className="space-y-3">
            {sensors.map((sensor) => (
              <li
                key={sensor.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-gray-800">
                    Sensor #{sensor.sensor_id} (Equipment {sensor.equipment_id})
                  </div>
                  <div className="text-sm text-gray-500">
                    Last Active: {new Date(sensor.datetime).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  Activity: {sensor.in_use ? "In Use" : "Idle"} | Battery:{" "}
                  {sensor.battery}%
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No sensor data found.</p>
        )}
      </CardContent>
    </Card>
  );
}
