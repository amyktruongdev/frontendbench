import { Card, CardContent } from "../ui/card";

export default function EquipmentUsageCards({ usage }: { usage: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {usage.map((item) => (
        <Card key={item.equipment_name} className="border-red-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-red-600 text-center">
              {item.equipment_name}
            </h3>
            <p className="text-center text-gray-700">
              {item.in_use} / {item.total} in use
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
