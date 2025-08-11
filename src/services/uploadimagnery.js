import ip from "../values/values.js";

export const uploadSatelliteImagery = async ({ projectId, files }) => {
  try {
    const formData = new FormData();
    formData.append("id", projectId);

    // Append each band
    for (const [band, file] of Object.entries(files)) {
      if (file) {
        formData.append(band, file);
      }
    }

    const response = await fetch(`${ip}/api/projects/${projectId}/satellite-imagery`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload satellite imagery");
    return await response.json();
  } catch (error) {
    console.error("Error uploading satellite imagery:", error);
    throw error;
  }
};


export const uploadDroneImagery = async ({ projectId, file }) => {
  try {
    const formData = new FormData();
    formData.append("id", projectId);
    formData.append("file", file);

    const response = await fetch(`${ip}/api/projects/${projectId}/drone-imagery`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload drone imagery");
    return await response.json();
  } catch (error) {
    console.error("Error uploading drone imagery:", error);
    throw error;
  }
};
