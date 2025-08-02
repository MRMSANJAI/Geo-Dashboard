import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../../services/api";
import StatsCard from "../../components/dashboard/StatsCard";
import Charts from "../../components/dashboard/Charts";
import ProjectTable from "../../components/layout/ProjectTable";
import ProjectCard from "./ProjectCard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <StatsCard data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Charts chartData={data.chartData} />
        <ProjectTable projects={data.projects} />
      </div>
      <div className="p-6">
      <ProjectCard project={sampleData} />
    </div>
    </div>
  );
}
