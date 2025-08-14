import ip from "../values/values.js";

const logFormData = (formData) => {
  console.log("=== FormData Preview ===");
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? value.name : value);
  }
  console.log("==");
};


// Satellite upload
export const uploadSatelliteImagery = async ({ projectId, files }) => {
  if (!projectId) throw new Error("❌ Missing projectId for satellite upload");

  const hasFiles = Object.values(files).some((file) => file instanceof File);
  if (!hasFiles) throw new Error("❌ No satellite band files selected");

  try {
    const formData = new FormData();
    formData.append("raster_type", "satellite");

    for (const [band, file] of Object.entries(files)) {
      if (file instanceof File) {
        formData.append(band, file);
      }
    }

    logFormData(formData);

    const response = await fetch(`${ip}/api/projects/${projectId}/rasters/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`❌ Failed to upload satellite imagery: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading satellite imagery:", error);
    throw error;
  }
};

// Drone upload
export const uploadDroneImagery = async ({ projectId, file }) => {
  if (!projectId) throw new Error("❌ Missing projectId for drone upload");
  if (!(file instanceof File)) throw new Error("❌ No drone image file selected");

  try {
    const formData = new FormData();
    formData.append("raster_type", "drone");
    formData.append("raster", file);

    logFormData(formData);

    const response = await fetch(`${ip}/api/projects/${projectId}/rasters/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`❌ Failed to upload drone imagery: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading drone imagery:", error);
    throw error;
  }
};
