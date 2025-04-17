import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import EquipmentMapPage from "./components/ui/EquipmentMapPage";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import "./index.css";
import MFAVerificationPage from "./pages/MFAVerification";
//require('dotenv').config()

function Sidebar() {
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

function AdminPage() {
  return (
    <div className="text-center text-gray-700">
      <h1 className="text-3xl font-bold text-red-600">Admin Panel</h1>
      <p>This section is under construction.</p>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-red-50 min-h-screen">{children}</main>
    </div>
  );
}

function LandingPage() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const fakeResponse = { success: true, result: [{ result: 2 }] };
      setApiResponse(JSON.stringify(fakeResponse));
    } catch (err) {
      setApiResponse("Mock request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-red-300">
      <CardContent className="p-6 flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Welcome to OpenBench
        </h1>
        <p className="text-center text-gray-700">
          ADD SRC HOURS AND DIRECTORY.
        </p>
        <Button
          onClick={testBackend}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          {loading ? "Checking..." : "Test Backend"}
        </Button>
        {apiResponse && (
          <p className="text-sm text-center text-gray-700 break-words">
            Response: {apiResponse}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_DOMAIN_NAME}api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pwd }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Redirect to MFA page
      navigate("/mfa", { state: { userId: data.userId, email } });
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-red-300">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          OpenBench Login
        </h1>
        {error && (
          <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="uname"
              className="block mb-1 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="uname"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label
              htmlFor="psw"
              className="block mb-1 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="psw"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Enter Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked name="remember" /> Remember
              me
            </label>
            <Link
              to="/forgot-password"
              className="text-red-500 hover:text-red-600"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600"
            >
              Login
            </button>
            <Link
              to="/registration"
              className="w-full py-2 px-4 rounded-lg bg-gray-200 text-center text-gray-800 hover:bg-gray-300"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion1: "What was the name of your first pet?",
    answer1: "",
    securityQuestion2: "What is your mother’s maiden name?",
    answer2: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_DOMAIN_NAME + "api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            fName: formData.firstName,
            lName: formData.lastName,
            email: formData.email,
            pwd: formData.password,
            security_question_1: formData.securityQuestion1,
            answer_1: formData.answer1,
            security_question_2: formData.securityQuestion2,
            answer_2: formData.answer2,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccessMessage("Account created successfully!");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-red-300">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
          Create Your Account
        </h1>
        {error && (
          <p className="text-red-600 text-sm text-center mb-2">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm text-center mb-2">
            {successMessage}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Security Question 1
            </label>
            <select
              name="securityQuestion1"
              value={formData.securityQuestion1}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>What was the name of your first pet?</option>
              <option>What city were you born in?</option>
              <option>What is your favorite book?</option>
            </select>
            <input
              name="answer1"
              type="text"
              placeholder="Answer"
              value={formData.answer1}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Security Question 2
            </label>
            <select
              name="securityQuestion2"
              value={formData.securityQuestion2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>What is your mother’s maiden name?</option>
              <option>What was your childhood nickname?</option>
              <option>What is your favorite food?</option>
            </select>
            <input
              name="answer2"
              type="text"
              placeholder="Answer"
              value={formData.answer2}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Create Account
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EquipmentPage() {
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

function EquipmentUsageCards({ usage }: { usage: any[] }) {
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

function DashboardFooter() {
  return (
    <div className="mt-12 bg-white border-t border-gray-300 pt-6 text-gray-700 text-sm max-w-4xl mx-auto px-4">
      <div className="mb-4">
        <div className="w-32 h-2 bg-red-600 mb-2" />
        <h2 className="text-xl font-bold text-black leading-tight">
          Student Recreation Center
        </h2>
        <p className="text-gray-500 mb-2">University Student Union</p>
        <hr className="my-2 border-gray-300" />
        <p className="font-semibold text-black">University Student Union</p>
        <p>18111 Nordhoff Street</p>
        <p>Northridge, CA 91330-8449</p>
        <p className="mt-2">
          <span className="font-semibold text-black">Phone:</span> (818)
          677-5434
        </p>
        <p className="text-red-600 underline mt-2 cursor-pointer hover:text-red-700">
          Send email
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-md font-bold text-black">Building Hours</h3>
            <p>Mon–Fri: 6 a.m. – 10 p.m.</p>
            <p>Sat–Sun: 9 a.m. – 5 p.m.</p>
          </div>

          <div>
            <h3 className="text-md font-bold text-black">Rec Pool</h3>
            <p>
              <em>Jan 18 – Mar 16</em>: Mon–Fri: 6 a.m. – 7 p.m.
              <br />
              Sat–Sun: 9 a.m. – 4:30 p.m.
            </p>
            <p className="mt-1">
              <em>Mar 17 – May 11</em>: Mon–Fri: 6 a.m. – 9:30 p.m.
              <br />
              Sat–Sun: 9 a.m. – 4:30 p.m.
            </p>
          </div>

          <div>
            <h3 className="text-md font-bold text-black">Ridge Rock Wall</h3>
            <p>
              Mon–Fri: 2 – 9 p.m.
              <br />
              Sat: Noon – 4 p.m.
              <br />
              Sun: Closed
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_DOMAIN_NAME + "api/dashboard/summary"
        );
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const usageRate = summary?.usageRate || 0;
  let statusBanner = null;

  if (usageRate >= 75) {
    statusBanner = (
      <div className="mt-6 w-full bg-red-600 text-white font-bold text-center text-xl py-3 rounded-lg shadow-lg animate-pulse ring-2 ring-red-300">
        🔥 GYM IS EXTREMELY BUSY 🔥
      </div>
    );
  } else if (usageRate >= 65) {
    statusBanner = (
      <div className="mt-6 w-full bg-yellow-400 text-black font-bold text-center text-xl py-3 rounded-lg shadow-md ring-2 ring-yellow-300">
        Gym is Moderately Busy
      </div>
    );
  } else {
    statusBanner = (
      <div className="mt-6 w-full bg-green-200 text-green-900 font-bold text-center text-xl py-3 rounded-lg shadow-sm ring-2 ring-green-300">
        ✅ Gym is Not Busy
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-extrabold text-red-500 tracking-wider mb-1 drop-shadow">
          OpenBench
        </h1>
        <p className="text-gray-600 text-lg">
          {currentTime.toLocaleDateString()} •{" "}
          {currentTime.toLocaleTimeString()}
        </p>
      </div>
      <Card className="border-red-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">
            Dashboard Overview
          </h2>
          {loading || !summary ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <div className="text-center space-y-2">
              <p>🏋️‍♂️ Equipment Count: {summary.equipmentCount}</p>
              {statusBanner}
            </div>
          )}
        </CardContent>
      </Card>
      {summary?.equipmentUsage && (
        <EquipmentUsageCards usage={summary.equipmentUsage} />
      )}
      <DashboardFooter />
    </div>
  );
}

function SensorStatusPage() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_DOMAIN_NAME + "api/sensors/status"
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

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/equipment-map" element={<EquipmentMapPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/sensors" element={<SensorStatusPage />} />
          <Route path="/mfa" element={<MFAVerificationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/technician" element={<div>Technician Tools</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}
