import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";

export default function GlobalHeader({ title = "Geosavvy", user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3 shadow-md"
      style={{
        background: "linear-gradient(to right, #02353C, #2EAF7D)",
        color: "#FFFFFF",
      }}
    >
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="relative" ref={dropdownRef}>
        <img
          src={logo} 
          alt="User Avatar"
          className="h-10 w-10 rounded-full cursor-pointer border-2 border-white"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold">{user?.name || "John Doe"}</p>
              <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
            </div>
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
