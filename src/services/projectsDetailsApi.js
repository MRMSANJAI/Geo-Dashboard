
// // import ip from "../values/values.js";

// // export const fetchProjectById = async (id) => {
// //   try {
// //     const response = await fetch(`${ip}/api/projects/dashboard`);
// //     if (!response.ok) {
// //       throw new Error("Failed to fetch dashboard data");
// //     }

// //     const data = await response.json();

// //     // Make sure id is number and match project
// //     const targetId = parseInt(id);
// //     const project = data.projects.find((p) => p.id === targetId);

// //     return project || null;
// //   } catch (error) {
// //     console.error("Error fetching project by ID:", error);
// //     return null;
// //   }
// // };

// import ip from "../values/values.js";

// export const fetchProjectById = async (id) => {
//   try {
//     const response = await fetch(`${ip}/api/projects/dashboard`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch dashboard data");
//     }

//     const data = await response.json();
//     const targetId = parseInt(id, 10);

//     // find project by id
//     const project = data.projects.find((p) => p.id === targetId);

//     return project || null;
//   } catch (error) {
//     console.error("Error fetching project by ID:", error);
//     return null;
//   }
// };


import ip from "../values/values.js";

export const fetchProjectById = async (id) => {
  try {
    // Directly call the endpoint that returns the specific project details
    const response = await fetch(`${ip}/api/projects/${id}/dashboard`);

    if (!response.ok) {
      throw new Error(`Failed to fetch project details for ID: ${id}`);
    }

    const project = await response.json();

    return project; // Return the project details object directly
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};