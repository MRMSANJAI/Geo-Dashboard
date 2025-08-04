export const fetchDashboardData = async () => {
  try {
    const response = await fetch("http://192.168.29.152:8000/api/dashboard-data/", {
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
