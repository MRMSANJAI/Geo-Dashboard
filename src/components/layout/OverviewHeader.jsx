// src/components/overview/OverviewHeader.jsx
import React from 'react';

export default function OverviewHeader({ title }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-2xl font-semibold text-white tracking-wide">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        <select className="bg-[#1e293b] text-white text-sm px-3 py-2 rounded-md outline-none border border-[#334155]">
          <option>All Projects</option>
          <option>Project A</option>
          <option>Project B</option>
        </select>

        <select className="bg-[#1e293b] text-white text-sm px-3 py-2 rounded-md outline-none border border-[#334155]">
          <option>Date Range</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
    </div>
  );
}
