import React from "react";

export default function GlobalHeader({ title = "Geosavvy" }) {
  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3 shadow-md"
      style={{
        background: "linear-gradient(to right, #02353C, #2EAF7D)",
        color: "#FFFFFF",
      }}
    >
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="space-x-3">
        <button className="text-white hover:bg-white/20 border border-white px-3 py-1 rounded transition duration-200">
          Log Out
        </button>
        <button className="bg-white text-[#02353C] hover:bg-[#C1F6ED] px-3 py-1 rounded transition duration-200">
          Sign up
        </button>
      </div>
    </header>
  );
}
