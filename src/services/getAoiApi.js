import ip from "../values/values.js";

export const getAoi = async (id) => {
  try {
    console.log("Fetching AOI for ID:", id);
    const response = await fetch(`${ip}/api/projects/${id.id}/datafiles`, 
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

// import ip from "../values/values.js";

// export const getAoi = async (id) => {
//   try {
//     console.log("Fetching AOI for ID:", id);
//     const response = await fetch(`${ip}/api/projects/${id.id}/datafiles`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch dashboard data");

//     const data = await response.json();

//     // ✅ Filter for active AOI only
//     const activeLayers = data.filter((item) => item.is_active === true);

//     return activeLayers;

//   } catch (error) {
//     console.error("API Error:", error);
//     return null;
//   }
// };