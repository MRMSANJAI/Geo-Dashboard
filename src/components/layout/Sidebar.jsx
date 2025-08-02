import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TreePine, FileText, MapPin, LineChart, Globe2 } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Overview', icon: <Home size={18} /> },
    { path: '/lulc-change', label: 'LULC Change', icon: <MapPin size={18} /> },
    { path: '/carbon-zones', label: 'Carbon Zones', icon: <LineChart size={18} /> },
    { path: '/tree-census', label: 'Tree Census', icon: <TreePine size={18} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
    { path: '/map', label: 'Map View', icon: <Globe2 size={18} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#02353C] text-white p-5">
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
              ${isActive
                ? 'bg-[#2EAF7D] text-white'
                : 'hover:bg-[#2EAF7D]/20 text-white'}`
            }
          >
            {icon}
            <span className="text-sm font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
