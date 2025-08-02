import React from "react";
import { FaCircle } from "react-icons/fa";

export default function ProjectCard({ project }) {
  const { totalProjects, ongoingProjects, closedProjects, projects } = project;

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-xl shadow-md text-[#333333]">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
      <div className="relative border-l-2 border-[#C1F6ED] pl-6">
        {projects.map((proj, index) => (
          <div key={index} className="mb-6 relative">
            <div
              className={`absolute -left-[11px] top-[5px] w-3 h-3 rounded-full ${
                proj.status === "Ongoing"  ? "bg-[#2EA7E0]"  : proj.status === "Closed"  ? "bg-gray-400": "bg-[#28A74E]" }`} ></div>

            <div className="bg-[#F8F9FA] p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-[#02353C]">{proj.name}</h4>
              <p className="text-sm mt-1">
                <span className="font-medium">Status:</span>{" "}
                <span  className={`font-semibold ${ proj.status === "Ongoing"  ? "text-[#2EA7E0]"  : proj.status === "Closed"  ? "text-gray-500"  : "text-[#28A74E]" }`}  >
                  {proj.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Start:</span> {proj.startDate}
              </p>
              <p className="text-sm">
                <span className="font-medium">End:</span> {proj.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
