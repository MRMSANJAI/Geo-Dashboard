// src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import GlobalHeader from "./GlobalHeader";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen #C1F6ED text-[#02353C] flex flex-col">  
      <GlobalHeader />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <main className="p-4 flex-1 overflow-auto bg-[#F8F9FA]">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
