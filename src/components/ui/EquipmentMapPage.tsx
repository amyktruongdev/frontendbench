import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import io from "socket.io-client";

interface EquipmentItem {
  equipment_id: string;
  equipment_name: string;
  in_use: number;
  last_updated: string;
}

const socket = io(process.env.REACT_APP_DOMAIN_NAME, {
  transports: ["websocket"],
});

const EquipmentMapPage = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_DOMAIN_NAME}api/equipment/map` // Changed api endpoin here
        );
        const rawData = await res.json();
        console.log("📦 Equipment data:", rawData);
        if (Array.isArray(rawData)) {
          const data = rawData.map((item: any) => ({
            ...item,
            in_use: item.in_use === "in_use" ? 1 : 0,
          }));
          setEquipment(data);
        } else {
          console.error(
            "❌ Equipment map API did not return an array:",
            rawData
          );
          setEquipment([]);
        }
      } catch (error) {
        console.error("❌ Failed to load equipment data:", error);
        setEquipment([]);
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    socket.on("statusUpdate", (data) => {
      console.log("Received real-time status update:", data);

      setEquipment((prev) =>
        prev.map((eq) =>
          eq.equipment_id === data.equipmentId
            ? {
                ...eq,
                in_use: data.inUse ? 1 : 0,
                last_updated: new Date().toISOString(),
              }
            : eq
        )
      );
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  const equipmentById = (id: string) => {
    if (!Array.isArray(equipment)) return undefined;
    const numericId = parseInt(id.replace("EQUIP-", ""), 10);

    return equipment.find((e) => Number(e.equipment_id) === numericId);
  };

  const renderBox = (id: string) => {
    const eq = equipmentById(id);
    const statusColor = eq
      ? eq.in_use
        ? "bg-red-200"
        : "bg-green-200"
      : "bg-gray-100";
    const tooltip = eq
      ? `Equipment: ${eq.equipment_name}\nID: ${eq.equipment_id}\nStatus: ${
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
          "EQUIP-63",
          "EQUIP-64",
          "EQUIP-65",
          "EQUIP-66",
          "EQUIP-67",
          "EQUIP-68",
          "EQUIP-69",
          "EQUIP-70",
          "EQUIP-71",
          "EQUIP-72",
          "EQUIP-73",
          "EQUIP-74",
          "EQUIP-75",
          "EQUIP-76",
          "EQUIP-77",
          "EQUIP-78",
          "EQUIP-79",
          "EQUIP-80",
          "EQUIP-81",
        ].map(renderBox)}
      </div>
    </div>
  );
};

export default EquipmentMapPage;
