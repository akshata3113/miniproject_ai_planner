import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Safely parse user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  // Generate initials (supports First + Last name)
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");  // redirect to login
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="p-3 shadow-sm flex justify-between items-center px-5 h-20 bg-white">
      <Link to="/">
        <img src="/logo.png" alt="Logo" className="h-20 cursor-pointer" />
      </Link>

      <nav className="flex items-center gap-3">
        {!token ? (
          <>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </>
        ) : (
          <div className="relative" ref={menuRef}>
            {/* Avatar */}
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-[#f56551] text-white flex items-center justify-center text-lg font-semibold cursor-pointer select-none"
            >
              {initials}
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-md rounded-md overflow-hidden border z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => navigate("/trip-history")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  🗺 Trip History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
