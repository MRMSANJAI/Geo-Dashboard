import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#28A74E", "#fa0a8a"];

export default function ProjectPieChart({ chartData }) {
  return (
    <div className="bg-[#FFFFFF] p-4 rounded-xl text-[#333333] w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Project Status</h2>

      {/* Responsive Container */}
      
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              // label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
             <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
