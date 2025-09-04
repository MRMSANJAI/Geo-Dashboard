import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useParams } from "react-router-dom";
import { fetchProjectById } from "../../services/projectsDetailsApi";
import ProjectSidebar from "./ProjectSidebar";

export default function ProjectDetailLayout() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [savedPolygons, setSavedPolygons] = useState([]);


  // ✅ Fetch logic
  const refreshProject = useCallback(async () => {
    setLoading(true);
    const data = await fetchProjectById(id);
    setProject(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    refreshProject();
  }, [refreshProject]);

  // ✅ Add this function for updating tags locally without refresh
  const updateProjectTags = useCallback((newTag) => {
    setProject((prevProject) => {
      if (prevProject?.tags?.includes(newTag)) {
        return prevProject;
      }
      return {
        ...prevProject,
        tags: [...(prevProject?.tags || []), newTag]
      };
    });
  }, []);

  if (loading) {
    return (
      
      <div className="flex min-h-screen">
        <div className="hidden md:block fixed left-0 h-screen w-64 bg-[#121b24]">
          <ProjectSidebar />
        </div>
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <p className="text-gray-500">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar - fixed for desktop */}
      <div className="hidden md:block fixed left-0 h-screen w-64 bg-[#121b24]">
        <ProjectSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64 min-h-screen bg-[#C1F6ED]/20 p-6">
        <Outlet context={{ project, refreshProject, updateProjectTags,showProcessingOverlay,setShowProcessingOverlay ,savedPolygons,setSavedPolygons}} />
      </div>
    </>
  );
}
