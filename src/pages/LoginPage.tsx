import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
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
