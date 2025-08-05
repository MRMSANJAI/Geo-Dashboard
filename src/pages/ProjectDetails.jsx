// src/pages/ProjectDetail.jsx
import React from "react";

const dummyProject = {
  title: "Urban Development Analysis",
  date: "2025-07-25",
  status: true,
  endpoint: "https://example.com/projects/urban-development",
  tags: ["AOI", "Imagery", "NDVI", "LULC", "Report"],
};

export default function ProjectDetail() {
  const project = dummyProject;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
      <p className="text-gray-600 text-sm mb-4">Date: {project.date}</p>

      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          project.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {project.status ? "Ongoing" : "Closed"}
      </span>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700">Endpoint:</h2>
        <a
          href={project.endpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-words"
        >
          {project.endpoint}
        </a>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700">Tags:</h2>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
