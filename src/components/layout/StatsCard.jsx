import React from "react";

const StatCard = ({ label, value, bgColor }) => (
  <div className="relative overflow-hidden group rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300">

    <div
      className="absolute left-0 top-0 h-full w-1 z-10"
      style={{ backgroundColor: bgColor }}
    ></div>


    <div className="absolute inset-0 z-0 w-0 group-hover:w-full transition-all duration-500 ease-in-out">
      <div className="w-full h-full" style={{ background: `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 100%)`, }}></div>
    </div>

    <div className="relative z-20 pl-4 font-sans">
      <p className="text-xl font-medium text-[#000000] group-hover:text-black transition-colors duration-300">
        {label}
      </p>
      <h3 className="text-md font-bold text-[#000000] group-hover:text-black transition-colors duration-300">
        {value}
      </h3>
    </div>
  </div>
);

export default function StatsCard({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Projects"
        value={data.totalProjects}
        bgColor="green"
      />
      <StatCard
        label="Ongoing Projects"
        value={data.ongoingProjects}
        bgColor="teal"
      />
      <StatCard
        label="Closed Projects"
        value={data.closedProjects}
        bgColor="red"
      />
    </div>
  );
}
