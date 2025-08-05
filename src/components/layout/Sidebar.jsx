import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TreePine, FileText, MapPin, LineChart, Globe2 } from 'lucide-react'; // You can change icon if needed

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={18} /> },
    // { path: '/lulc-change', label: 'LULC Change', icon: <MapPin size={18} /> },
    // { path: '/carbon-zones', label: 'Carbon Zones', icon: <LineChart size={18} /> },
    // { path: '/tree-census', label: 'Tree Census', icon: <TreePine size={18} /> },
    // { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
    { path: '/map', label: 'Map View', icon: <Globe2 size={18} /> }, // ✅ New Map Page
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
              ${isActive ? 'bg-[#1d2a35] text-green-400' : 'hover:bg-[#1a2630]'}`
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

export default Sidebar;
