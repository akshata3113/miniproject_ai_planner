import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg);
        return;
      }

      setSuccess("Registered successfully! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_60%)]">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border">
        <h2 className="text-3xl font-bold text-center" style={{ color: "#ff6b5a" }}>
          Create Account
        </h2>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button className="w-full bg-[#ff8b2e] text-white py-2 rounded-md font-medium hover:opacity-90">
            Register
          </button>
        </form>

        <p
          className="text-center mt-4 text-gray-700 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? <span className="underline font-medium">Login</span>
        </p>
      </div>
    </div>
  );
}
