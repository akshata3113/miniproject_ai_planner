import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg);
        return;
      }

      setMessage("Password reset link sent to your email!");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_60%)]">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border">
        <h2 className="text-3xl font-bold text-center" style={{ color: "#ff6b5a" }}>
          Forgot Password
        </h2>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        {message && <p className="text-green-600 mt-3 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200"
          />

          <button className="w-full bg-[#ff8b2e] text-white py-2 rounded-md font-medium hover:opacity-90">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
