import { useEffect, useState } from "react";
import io from "socket.io-client";

interface EquipmentItem {
  equipment_id: string;
  equipment_name: string;
  in_use: number;
  sensor_id: string;
  battery: number;
  last_updated: string;
}

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
});

const EquipmentMapPage = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN_NAME}api/equipment/map`);
        const rawData = await res.json();
        console.log("📦 Equipment data:", rawData);

        if (Array.isArray(rawData)) {
          const data = rawData.map((item: any) => ({
            ...item,
            in_use: item.in_use === "in_use" ? 1 : 0,
          }));
          setEquipment(data);
        } else {
          console.error("❌ Equipment map API did not return an array:", rawData);
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
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("statusUpdate", (data) => {
      console.log("📡 Real-time update:", data);

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
        ? "bg-red-200 border-red-500"
        : "bg-green-200 border-green-500"
      : "bg-gray-100 border-gray-300";
    const tooltip = eq
      ? `Equipment: ${eq.equipment_name}\nSensor: ${eq.sensor_id}\nID: ${eq.equipment_id}\nBattery: ${eq.battery}%\nStatus: ${eq.in_use ? "In Use" : "Available"
      }`
      : "Not assigned";
    const label = eq ? eq.equipment_name : "N/A";

    return (
      <div
        key={id}
        role="button"
        aria-label={
          eq
            ? `${eq.equipment_name}, Sensor ${eq.sensor_id}, Battery ${eq.battery}%, Status ${eq.in_use ? "In Use" : "Available"}`
            : `Equipment ID ${id} not assigned`
        }
        className={`w-32 sm:w-36 h-24 flex flex-col items-center justify-center text-center text-sm font-medium rounded-lg shadow-md transition-all duration-150 hover:scale-105 ${statusColor}`}
        title={
          eq
            ? `Equipment: ${eq.equipment_name}\nSensor: ${eq.sensor_id}\nBattery: ${eq.battery}%\nStatus: ${eq.in_use ? "In Use" : "Available"}`
            : "Not assigned"
        }
      >
        <span className="font-semibold text-gray-800 truncate w-32">{label}</span>
        <span className="text-xs text-gray-600 mt-1">ID: {id}</span>
      </div>
    );
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto p-6" role="main" aria-label="Equipment Map Page">
      <header className="text-center mb-12" role="banner">
        <h1 className="text-5xl font-extrabold text-red-500 tracking-wider mb-1 drop-shadow">
          OpenBench
        </h1>
        <p className="text-gray-600 text-md" aria-live="polite">
          {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
        </p>
      </header>

      <section
        className="bg-gray-50 rounded-lg shadow p-6 mb-12"
        role="region"
        aria-labelledby="equipment-map-heading"
      >
        <h2 id="equipment-map-heading" className="text-3xl font-bold text-red-600 mb-6 text-center">
          Equipment Floor Map
        </h2>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center"
          role="group"
          aria-label="Gym Equipment Grid"
        >
          {[
            "EQUIP-63", "EQUIP-64", "EQUIP-65", "EQUIP-66", "EQUIP-67",
            "EQUIP-68", "EQUIP-69", "EQUIP-70", "EQUIP-71", "EQUIP-72",
            "EQUIP-73", "EQUIP-74", "EQUIP-75", "EQUIP-76", "EQUIP-77",
            "EQUIP-78", "EQUIP-79", "EQUIP-80", "EQUIP-81"
          ].map(renderBox)}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-300 pt-6 text-gray-700 text-sm text-center rounded-t-lg shadow-inner" role="contentinfo">
        <div className="mb-4">
          <div className="w-32 h-2 bg-red-600 mb-2 mx-auto" />
          <h2 className="text-lg font-bold text-black">Student Recreation Center</h2>
          <p className="text-gray-500">University Student Union</p>
          <hr className="my-2 border-gray-300 w-1/2 mx-auto" />
          <p>18111 Nordhoff Street, Northridge, CA 91330-8449</p>
          <p className="mt-1 font-semibold">Phone: (818) 677-5434</p>
          <a href="mailto:info@csun.edu" className="text-red-600 underline mt-1 hover:text-red-700 cursor-pointer">
            Send email
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 px-4">
          <div>
            <h3 className="text-md font-bold text-black">Building Hours</h3>
            <p>Mon–Fri: 6 a.m. – 10 p.m.</p>
            <p>Sat–Sun: 9 a.m. – 5 p.m.</p>
          </div>
          <div>
            <h3 className="text-md font-bold text-black">Rec Pool</h3>
            <p><em>Jan 18 – Mar 16</em>:<br />Mon–Fri: 6 a.m. – 7 p.m.<br />Sat–Sun: 9 a.m. – 4:30 p.m.</p>
            <p className="mt-1"><em>Mar 17 – May 11</em>:<br />Mon–Fri: 6 a.m. – 9:30 p.m.<br />Sat–Sun: 9 a.m. – 4:30 p.m.</p>
          </div>
          <div>
            <h3 className="text-md font-bold text-black">Ridge Rock Wall</h3>
            <p>Mon–Fri: 2 – 9 p.m.<br />Sat: Noon – 4 p.m.<br />Sun: Closed</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default EquipmentMapPage;
