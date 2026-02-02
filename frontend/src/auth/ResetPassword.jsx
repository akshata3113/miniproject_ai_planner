import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg);
        return;
      }

      setSuccess("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_60%)] px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border">
        <h2 className="text-3xl font-bold text-center" style={{ color: "#ff6b5a" }}>
          Reset Password
        </h2>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="New Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-200"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-200"
          />

          <button className="w-full bg-[#ff8b2e] text-white py-2 rounded-md font-medium hover:opacity-90">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
