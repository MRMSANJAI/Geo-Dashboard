import React from "react";

export default function ProjectTable({ projects }) {
  return (
    <div className="bg-[#FFFFFF] p-4 rounded-xl shadow-md w-full">
      <h2 className="text-lg mb-4 font-semibold text-[#333333]">Projects</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-[#333333]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-gray-200 text-left">
              <th className="py-2 px-4 whitespace-nowrap">Name</th>
              <th className="py-2 px-4 whitespace-nowrap">Status</th>
              <th className="py-2 px-4 whitespace-nowrap">Start Date</th>
              <th className="py-2 px-4 whitespace-nowrap">End Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={index}
                className={`border-t border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"
                }`}
              >
                <td className="py-2 px-4 whitespace-nowrap">{project.name}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      project.status === "Ongoing"
                        ? "bg-[#2EA7E0]/20 text-[#2EA7E0]"
                        : project.status === "Closed"
                        ? "bg-gray-200 text-[#333333]"
                        : "bg-[#28A74E]/20 text-[#28A74E]"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {project.startDate}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {project.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
