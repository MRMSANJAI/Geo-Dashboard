// src/components/ProjectList.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProjectList = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="border rounded p-4 shadow bg-white">
          <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
          <p className="text-sm text-gray-600">{project.description}</p>
          <Link
            to={`/project/${project.id}`}
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            View Project →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
