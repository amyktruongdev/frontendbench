import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
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
