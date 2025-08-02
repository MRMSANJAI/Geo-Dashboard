// src/components/layout/ProjectPieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

// Updated to Geosavvy palette: Green, Blue, Gray
const COLORS = ["#28A74E", "#2EA7E0", "#CCCCCC"];

export default function ProjectPieChart({ chartData }) {
  return (
    <div className="bg-[#FFFFFF] p-4 rounded-xl text-[#333333] ">
      <h2 className="text-lg font-semibold mb-2">Project Status</h2>
      <PieChart width={300} height={250}>
        <Pie  data={chartData} dataKey="value" nameKey="name" outerRadius={80} label fill="#333333" >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
}
