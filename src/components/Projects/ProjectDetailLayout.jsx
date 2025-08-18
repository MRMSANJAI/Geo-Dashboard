// import React, { useEffect, useState } from "react";
// import { Outlet, useParams } from "react-router-dom";
// import { fetchProjectById } from "../../services/projectsDetailsApi";
// import ProjectSidebar from "./ProjectSidebar";


// export default function ProjectDetailLayout() {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProjectById(id).then((data) => {
//       setProject(data);
//       setLoading(false);
//     });
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen mt-5">
//         <ProjectSidebar />
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-gray-500">Loading project details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex">
//       {/* Sidebar - fixed for desktop */}
//       <div className="hidden md:block fixed left-0 h-screen w-64 bg-[#121b24]">
//         <ProjectSidebar />
//       </div>

//       {/* Main content area */}
//       <div style={{ height: "100vh"}} className="flex-1 md:ml-64 min-h-screen bg-[#C1F6ED]/20 p-6 ">
//         {loading ? ( <p className="text-gray-500 text-center mt-10">Loading project...</p>
//         ) : (
//           <Outlet context={{ project }} />
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useParams } from "react-router-dom";
import { fetchProjectById } from "../../services/projectsDetailsApi";
import ProjectSidebar from "./ProjectSidebar";

export default function ProjectDetailLayout() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ put fetch logic into a reusable function
  const refreshProject = useCallback(async () => {
    setLoading(true);
    const data = await fetchProjectById(id);
    setProject(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    refreshProject();
  }, [refreshProject]);

  if (loading) {
    return (
      <div className="flex min-h-screen mt-5">
        <ProjectSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar - fixed for desktop */}
      <div className="hidden md:block fixed left-0 h-screen w-64 bg-[#121b24]">
        <ProjectSidebar />
      </div>

      {/* Main content area */}
      <div
        style={{ height: "100vh" }}
        className="flex-1 md:ml-64 min-h-screen bg-[#C1F6ED]/20 p-6"
      >
        <Outlet context={{ project, refreshProject }} /> 
        {/* ✅ now both project + refresh available */}
      </div>
    </div>
  );
}
