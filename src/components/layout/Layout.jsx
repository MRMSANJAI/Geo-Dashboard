import React from "react";
import Sidebar from "./Sidebar";
import GlobalHeader from "./GlobalHeader";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith("/project-detail");

  return (
<div className="flex h-screen overflow-hidden bg-[#C1F6ED] text-[#02353C]">
  {/* Header */}
  <div className="fixed top-0 left-0 right-0 z-20 h-16">
    <GlobalHeader />
  </div>

  {/* Sidebar (only if not project detail) */}
  {!isProjectDetail && (
    <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] z-30">
      <Sidebar />
    </div>
  )}

  {/* Main Content */}
  <div
    className={`flex flex-col flex-1 ${!isProjectDetail ? "ml-64" : ""}`}
    style={{ marginTop: "4rem" }} // header height = 4rem (64px)
  >
    <main className="flex-1 overflow-auto px-4 bg-[#F8F9FA]">
      <Outlet />
    </main>
  </div>
</div>

  );
};

export default Layout;
