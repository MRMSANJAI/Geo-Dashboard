import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import Geosavvy from "../../assets/Geosavvy.png";
import { createPortal } from "react-dom";
import { useLocation , useNavigate } from 'react-router-dom';
import { Home } from "lucide-react";


export default function GlobalHeader({ title = "Geosavvy", user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
const location = useLocation();
const navigate = useNavigate();


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
    <>

<header
  className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 shadow-md z-50"
  style={{
    background: "linear-gradient(to right, #0f1c29, #2EAF7D)",
    color: "#FFFFFF",
  }}
>
  {/* Left: Logo + Title */}
  <div className="flex items-center gap-4">
    <img
      src={Geosavvy}
      alt="User Avatar"
      className="h-10 w-10 rounded-full cursor-pointer border-2"
    />
    <h1 className="text-xl font-bold">{title}</h1>
  </div>

  {/* Right: Button + User Avatar */}
  <div className="flex items-center gap-4">

{location.pathname !== "/" && (
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-1 rounded-lg  transition-transform hover:scale-105 cursor-pointer" //border hover:bg-gray-100
        >
          <Home className="w-7 h-7 font-medium text-3xl" strokeWidth={2}  /> {/* ✅ Home Icon */}
          {/* <span  className="text-sm font-medium">Home</span> */}
        </button>
      )}
    <div className="relative" ref={dropdownRef}>
      <img
        src={logo}
        alt="User Avatar"
        className="h-10 w-10 rounded-full cursor-pointer border-1"
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
  </div>
</header>

</>  
);
}
