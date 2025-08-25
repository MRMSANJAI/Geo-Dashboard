import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Home,
  MapPin,
  Image as ImageIcon,
  LineChart,
  FileText,
  TreeDeciduous,
  Menu,
  X,
} from "lucide-react";

const ProjectSidebar = () => {
  const { id } = useParams(); // dynamic route param
  const [isOpen, setIsOpen] = useState(false); // sidebar toggle (mobile)

  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: `/project-detail/${id}`, label: "Project Details", icon: <LineChart size={18} /> },
    { path: `aoi/${id}`, label: "AOI", icon: <MapPin size={18} /> },
    { path: `/project-detail/${id}/imagery`, label: "Imagery", icon: <ImageIcon size={18} /> },
    { path: `/project-detail/${id}/lulc`, label: "LULC", icon: <TreeDeciduous size={18} /> },
    { path: `/project-detail/${id}/report`, label: "Report", icon: <FileText size={18} /> },
  ];

  return (
    <>
      {/* 🔹 Mobile Header with Hamburger button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#121b24] text-white">
        <h1 className="text-lg font-semibold">Project Menu</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed lg:static  left-0 h-full w-64 bg-[#121b24] text-white p-5 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <nav className="flex flex-col space-y-2">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 
                ${isActive ? "bg-[#1d2a35] text-green-400" : "hover:bg-[#1a2630]"}`
              }
              end
              onClick={() => setIsOpen(false)} // close sidebar after clicking (mobile)
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 🔹 Overlay for mobile (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectSidebar;

