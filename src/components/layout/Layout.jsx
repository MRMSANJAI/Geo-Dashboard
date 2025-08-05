import React from "react";
import Sidebar from "./Sidebar";
import GlobalHeader from "./GlobalHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    
    <div className="flex h-screen overflow-hidden bg-[#C1F6ED] text-[#02353C]">
      
      <div className="fixed top-0 left-0 right-0 z-20 pb-5">
          <GlobalHeader />
        </div>
    
      <div className="mt-16 fixed top-0 left-0 w-64 h-full z-30">
        <Sidebar />
      </div>

 
      <div className="flex flex-col flex-1 ml-64 h-full">
        
      
        <main className="flex-1 overflow-auto pt-16 px-4 bg-[#F8F9FA]">
          <Outlet />
        </main>

     
      </div>
    </div>
  );
};

export default Layout;
