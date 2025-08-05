useEffect(() => {
  const dummyProjects = [
    { id: "1", name: "Solar Mapping", description: "Geo-tagged carbon data collection." },
    { id: "2", name: "Green Buildings", description: "Energy efficiency stats and modeling." },
  ];
  const found = dummyProjects.find((p) => p.id === id);
  setProject(found);
  setLoading(false);
}, [id]);

// import ip from "../values/values.js";


// const BASE_URL = ip + "/api/projects/dashboard"; // change if needed

// export const getAllProjects = async () => {
//   try {
//     const response = await fetch(BASE_URL);
//     if (!response.ok) throw new Error("Failed to fetch projects");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return [];
//   }
// };

// export const getProjectById = async (id) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${id}`);
//     if (!response.ok) throw new Error("Failed to fetch project");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return null;
//   }
// };
