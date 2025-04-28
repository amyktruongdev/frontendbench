import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        // Not admin - redirect them
        navigate("/dashboard");
        console.log("Current Role:", localStorage.getItem("role"));
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-red-600 text-center mb-8 drop-shadow">
        OpenBench Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-red-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>
            <Button
              onClick={() => navigate("/admin/manage-users")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Go to User Management
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Equipment</h2>
            <Button
              onClick={() => navigate("/admin/manage-equipment")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Go to Equipment Management
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">View Logs</h2>
            <Button
              onClick={() => navigate("/admin/logs")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              View System Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-300 hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Alert</h2>
            <Button
              onClick={() => navigate("/admin/send-alert")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Send Gym-Wide Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
