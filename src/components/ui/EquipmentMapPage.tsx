import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EquipmentItem {
  equipment_id: string;
  equipment_name: string;
  in_use: number;
  sensor_id: string;
  battery: number;
  last_updated: string;
}

const EquipmentMapPage = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DOMAIN_NAME}api/equipment/map`
        );
        const data = await res.json();
        console.log("📦 Equipment data:", data);
        if (Array.isArray(data)) {
          setEquipment(data);
        } else {
          console.error("❌ Equipment map API did not return an array:", data);
          setEquipment([]); // fallback to empty array
        }
      } catch (error) {
        console.error("❌ Failed to load equipment data:", error);
        setEquipment([]); // fallback to empty array
      }
    };
    fetchEquipment();
  }, []);

  const equipmentById = (id: string) => {
    if (!Array.isArray(equipment)) return undefined;
    return equipment.find((e) => e.equipment_id === id);
  };

  const renderBox = (id: string) => {
    const eq = equipmentById(id);
    const statusColor = eq
      ? eq.in_use
        ? "bg-red-200"
        : "bg-green-200"
      : "bg-gray-100";
    const tooltip = eq
      ? `Equipment: ${eq.equipment_name}\nSensor: ${eq.sensor_id}\nID: ${
          eq.equipment_id
        }\nBattery: ${eq.battery}%\nStatus: ${
          eq.in_use ? "In Use" : "Available"
        }`
      : "Not assigned";
    const label = eq ? eq.equipment_name : "N/A";

    return (
      <div
        key={id}
        className={`w-32 h-24 flex flex-col items-center justify-center text-center text-sm font-medium border border-gray-400 rounded ${statusColor}`}
        title={tooltip}
      >
        <span className="font-semibold text-gray-800">{label}</span>
        <span className="text-xs text-gray-600">ID: {id}</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Equipment Floor Map
      </h1>
      <div className="grid grid-cols-5 gap-4 justify-items-center">
        {[
          "EQUIP-001",
          "EQUIP-002",
          "EQUIP-003",
          "EQUIP-004",
          "EQUIP-005",
          "EQUIP-011",
          "EQUIP-012",
          "EQUIP-013",
          "EQUIP-014",
          "EQUIP-015",
          "EQUIP-021",
          "EQUIP-022",
          "EQUIP-023",
          "EQUIP-024",
          "EQUIP-025",
          "EQUIP-032",
          "EQUIP-033",
          "EQUIP-034",
          "EQUIP-035",
        ].map(renderBox)}
      </div>
    </div>
  );
};

export default EquipmentMapPage;
