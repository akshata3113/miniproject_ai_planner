import React from "react";
import { useNavigate } from "react-router-dom";

function UserSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-64 h-full border-r p-5 space-y-4 bg-[#fff8f0]">
      <h2 className="font-semibold text-lg mb-2">Account</h2>
      
      <button className="block text-left w-full" onClick={() => navigate("/profile")}>
        👤 Profile
      </button>

      <button className="block text-left w-full" onClick={() => navigate("/settings")}>
        ⚙️ Settings
      </button>

      <button className="block text-left w-full" onClick={() => navigate("/trip-history")}>
        🗺 Trip History
      </button>
      <button onClick={() => navigate("/create-trip")}>
  ✈️ Create Trip
</button>


      <button className="block text-left w-full text-red-600" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default UserSidebar;
