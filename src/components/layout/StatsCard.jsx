// src/components/dashboard/StatsCard.jsx
import React from "react";
import clsx from "clsx";

const StatCard = ({ label, value }) => (
  <div className="relative overflow-hidden group rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300">

    <div className="absolute inset-0 z-0">
      <div className="w-1 h-full bg-gradient-to-b from-[#3FD0C0] via-[#2EAF7D] to-[#449342] group-hover:w-full transition-all duration-500 ease-in-out"></div>
    </div>

    <div className="relative z-10 pl-4">
      <p className="text-sm font-medium text-[#2EA7E0] group-hover:text-[#02353C] transition-colors duration-300">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-[#333333] group-hover:text-[#02353C] transition-colors duration-300">
        {value}
      </h3>
    </div>
  </div>
);

export default function StatsCard({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Projects" value={data.totalProjects} />
      <StatCard label="Ongoing Projects" value={data.ongoingProjects} />
      <StatCard label="Closed Projects" value={data.closedProjects} />
    </div>
  );
}
