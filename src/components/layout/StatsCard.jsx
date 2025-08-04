import React from "react";

const StatCard = ({ label, value, borderColor, fromColor, toColor }) => (
  <div
    className={`relative group p-6 border-l-4 rounded-xl bg-white shadow-md hover:shadow-xl 
      transition-all duration-500 ease-in-out`}
    style={{
      borderColor: borderColor,
      }}
  >
    <div className="relative z-10">
      <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-white transition-colors duration-500">
        {label}
      </h2>
      <p className="text-gray-700 group-hover:text-white transition-colors duration-500">
        {value}
      </p>
    </div>

    {/* Gradient Overlay on Hover */}
    <div
      className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
      }}
    ></div>
  </div>
);

export default function StatsCard({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Projects"
        value={data.totalProjects}
        borderColor="#2EA7E0"
        fromColor="#2EA7E0"
        toColor="#02353C"
      />
      <StatCard
        label="Ongoing Projects"
        value={data.ongoingProjects}
        borderColor="#2EAF7D"
        fromColor="#2EAF7D"
        toColor="#449342"
      />
      <StatCard
        label="Closed Projects"
        value={data.closedProjects}
        borderColor="#F06292"
        fromColor="#F06292"
        toColor="#C2185B"
      />
    </div>
  );
}
