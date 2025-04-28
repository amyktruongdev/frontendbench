import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";

  const handleLogout = async () => {
    // Clear frontend storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    // Clear backend refresh cookie
    try {
      await fetch(`${process.env.REACT_APP_DOMAIN_NAME}api/auth/logout`, {
        method: "POST",
        credentials: "include", // Sends refreshToken cookie
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Redirect
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-red-200 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-red-600">Navigation</h2>
      <Link to="/">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Home
        </Button>
      </Link>
      <Link to="/login">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Login
        </Button>
      </Link>
      <Link to="/dashboard">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Dashboard
        </Button>
      </Link>
      <Link to="/registration">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Register
        </Button>
      </Link>
      <Link to="/equipment-map">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Equipment Map
        </Button>
      </Link>
      <Link to="/equipment">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Gym Equipment
        </Button>
      </Link>
      <Link to="/sensors">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Sensor Status
        </Button>
      </Link>
      {role === "admin" && (
        <Link to="/admin">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
            Admin Panel
          </Button>
        </Link>
      )}
      {role === "technician" && (
        <Link to="/technician">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
            Technician Tools
          </Button>
        </Link>
      )}
      <Button
        onClick={handleLogout}
        className="mt-auto bg-gray-300 text-black hover:bg-gray-400"
      >
        Logout
      </Button>
    </div>
  );
}