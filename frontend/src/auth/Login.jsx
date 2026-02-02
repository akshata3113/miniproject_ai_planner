import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid credentials");
        return;
      }

      // ✅ Store both token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Navigate to protected route
      navigate("/create-trip");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_60%)]">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border">
        <h2
          className="text-3xl font-bold text-center"
          style={{ color: "#ff6b5a" }}
        >
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 mt-2 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#ff8b2e] text-white py-2 rounded-md font-medium hover:opacity-90"
          >
            Login
          </button>

          {/* Forgot password */}
          <p
            className="text-center mt-3 text-gray-700 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>

        {/* Register link */}
        <p
          className="text-center mt-4 text-gray-700 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don't have an account?{" "}
          <span className="underline font-medium">Register</span>
        </p>
      </div>
    </div>
  );
}
