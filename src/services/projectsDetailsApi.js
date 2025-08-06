
import ip from "../values/values.js";

export const fetchProjectById = async (id) => {
  try {
    const response = await fetch(`${ip}/api/projects/dashboard`);
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();

    // Make sure id is number and match project
    const targetId = parseInt(id);
    const project = data.projects.find((p) => p.id === targetId);

    return project || null;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};

