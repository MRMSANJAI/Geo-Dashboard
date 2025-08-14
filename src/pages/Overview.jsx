import React, { useState } from "react";
import { uploadSatelliteImagery, uploadDroneImagery } from "../services/uploadimagnery.js";

export default function ProjectImagery() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadSatellite = async () => {
    setUploading(true);
    setProgress(0);

    try {
      await uploadSatelliteImagery({
        projectId: 10, // get from params
        files: {
          red: selectedRedFile,
          green: selectedGreenFile,
          blue: selectedBlueFile,
          nir: selectedNirFile,
        },
        onProgress: (percent) => setProgress(percent),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadDrone = async () => {
    setUploading(true);
    setProgress(0);

    try {
      await uploadDroneImagery({
        projectId: 10, // get from params
        file: selectedDroneFile,
        onProgress: (percent) => setProgress(percent),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Page Content */}
      <button onClick={handleUploadSatellite} className="btn btn-primary">Upload Satellite</button>
      <button onClick={handleUploadDrone} className="btn btn-secondary">Upload Drone</button>

      {/* Blocking UI */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <progress className="progress w-56" value={progress} max="100"></progress>
            <p className="mt-2 text-center">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
