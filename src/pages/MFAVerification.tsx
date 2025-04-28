import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function MFAVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DOMAIN_NAME}api/auth/verify-otc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, code }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "MFA verification failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-red-300"
      >
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          Enter One-Time Code
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          We emailed a 6-digit login code to your email.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
        <Button
          type="submit"
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
        >
          Verify
        </Button>
      </form>
    </div>
  );
}
