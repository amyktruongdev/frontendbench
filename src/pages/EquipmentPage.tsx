import { Card, CardContent } from "../components/ui/card";
import { useState, useEffect } from "react";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<
    { id: number; name: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_DOMAIN_NAME + "api/equipment/active"
        );
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto border-red-300">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">
          Active Gym Equipment
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : equipment.length > 0 ? (
          <ul className="space-y-3">
            {equipment.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between"
              >
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">
            No active equipment found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
