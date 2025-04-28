import { Card, CardContent } from "../ui/card";

export default function EquipmentUsageCards({ usage }: { usage: any[] }) {
  if (!usage || usage.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-6">
        No equipment data available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {usage.map((item) => {
        const usagePercent =
          item.total > 0 ? (item.in_use / item.total) * 100 : 0;
        let bgColor = "bg-green-100 border-green-300 text-green-800";

        if (usagePercent >= 75) {
          bgColor = "bg-red-100 border-red-300 text-red-800";
        } else if (usagePercent >= 50) {
          bgColor = "bg-yellow-100 border-yellow-300 text-yellow-800";
        }

        return (
          <Card
            key={item.equipment_name}
            className={`transition-all duration-500 ${bgColor}`}
          >
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {item.equipment_name}
              </h3>
              <p className="text-sm">
                {item.in_use} / {item.total} In Use
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
