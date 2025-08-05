// src/pages/Overview.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../services/api";
import StatsCard from "../components/layout/StatsCard";
import ProjectPieChart from "../components/layout/ProjectPieChart";
import ProjectTable from "../components/layout/ProjectTable";
import ProjectCard from "../components/layout/ProjectCard";

export default function Overview() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData().then((res) => setData(res));
  }, []);

  if (!data)
    return (
      <div className="text-[#333333] p-4 bg-[#F8F9FA]">Loading...</div>
    );

  return (
<>
          <div className="flex justify-between items-center p-4 bg-white shadow-md z-10 relative">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          + Create Project
        </button>
      </div>

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
    
    
 {/* Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
           <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Create Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              className="w-full px-3 py-2 border rounded mb-3"
            />
            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div> 
      )}


    </>
  );
}
