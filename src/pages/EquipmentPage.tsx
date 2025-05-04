import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

interface EquipmentInfo {
  equipmentId: number;
  name: string;
  type: string;
  location: string;
}

interface EquipmentStats {
  equipmentId: number;
  name: string;
  usageCount: number;
  usageDuration: number;
}

export default function EquipmentPage() {
  const [info, setInfo] = useState<EquipmentInfo[]>([]);
  const [stats, setStats] = useState<EquipmentStats[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchEquipmentInfo = async () => {
      try {
        const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}api/equipment/info`);
        const data = await res.json();
        setInfo(data);
      } catch (err) {
        console.error("Failed to fetch equipment info:", err);
      } finally {
        setLoadingInfo(false);
      }
    };

    const fetchEquipmentStats = async () => {
      try {
        const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}api/equipment/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch equipment stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchEquipmentInfo();
    fetchEquipmentStats();
  }, []);

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8" role="main" aria-label="Equipment Data Page">

      {/* Equipment Info */}
      <Card role="region" aria-label="Equipment Info">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Equipment Info</h2>
          {loadingInfo ? (
            <p className="text-center text-gray-600" role="status">Loading...</p>
          ) : (
            <ul className="divide-y divide-gray-200" role="list">
              {info.map(item => (
                <li key={item.equipmentId} className="py-3 flex justify-between">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm text-gray-500">{item.location}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Equipment Stats */}
      <Card role="region" aria-label="Equipment Stats">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Equipment Usage Stats</h2>
          {loadingStats ? (
            <p className="text-center text-gray-600" role="status">Loading...</p>
          ) : (
            <ul className="divide-y divide-gray-200" role="list">
              {stats.map(stat => (
                <li key={stat.equipmentId} className="py-3 flex justify-between items-center">
                  <span className="font-semibold">{stat.name}</span>
                  <span className="text-sm text-gray-600">Used: {stat.usageCount} times</span>
                  <span className="text-sm text-gray-500">
                    Total Time: {stat.usageDuration}s
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
