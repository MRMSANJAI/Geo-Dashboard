import ip from "../values/values.js";

export const projectDetails = async ({ id }) => {
  try {
    const response = await fetch(ip+`/api/projects/${id}`, 
      {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard data");

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};