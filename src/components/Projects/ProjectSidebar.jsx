import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Home,
  MapPin,
  LineChart,
  FileText,
} from "lucide-react";

const ProjectSidebar = () => {
  const { id } = useParams(); // Access dynamic route param

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <Home size={18} />,
    },
    {
      path: `/project-detail/${id}/aoi`,
      label: "AOI",
      icon: <MapPin size={18} />,
    },
    {
      path: `/project-detail/${id}/mapping`,
      label: "Mapping",
      icon: <LineChart size={18} />,
    },
    {
      path: `/project-detail/${id}/report`,
      label: "Report",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#121b24] text-white p-5">
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 
              ${isActive ? "bg-[#1d2a35] text-green-400" : "hover:bg-[#1a2630]"}`
            }
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default ProjectSidebar;
