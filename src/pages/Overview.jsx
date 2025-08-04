// src/pages/Overview.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../services/api";
import StatsCard from "../components/layout/StatsCard";
import ProjectPieChart from "../components/layout/ProjectPieChart";
import ProjectTable from "../components/layout/ProjectTable";
import ProjectCard from "../components/layout/ProjectCard";

export default function Overview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then((res) => setData(res));
  }, []);

  if (!data)
    return (
      <div className="text-[#333333] p-4 bg-[#F8F9FA]">Loading...</div>
    );

  return (
    <div className="space-y-6 p-6 bg-[#F8F9FA] text-[#333333] min-h-screen">
      {/* Top stats section */}
      <StatsCard data={data} />

      {/* Side-by-side: Pie chart and Table */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 bg-white rounded-xl shadow-md p-4">
          <ProjectPieChart chartData={data.chartData} />
        </div>
        <div className="md:w-1/2 bg-white rounded-xl shadow-md p-4">
          <ProjectTable projects={data.projects} />
        </div>
      </div>

      {/* Below the piechart+table row: ProjectCard */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <ProjectCard projects={data.projects} />
      </div>
    </div>
  );
}
