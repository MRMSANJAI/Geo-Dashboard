import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {uploadSatelliteImagery,uploadDroneImagery,} from "../../services/uploadimagnery.js";
import { fetchProjectById } from "../../services/projectsDetailsApi.js";

const ProjectImagery = () => {
  const { id } = useParams()
  const { refreshProject } = useOutletContext();
  
  const [projectTitle, setProjectTitle] = useState("");
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjectById(id);
      setProject(data);
    };
    loadProject();
  }, [id]);

  const [mode, setMode] = useState("satellite");
  const [satelliteFiles, setSatelliteFiles] = useState({
    red: null,
    green: null,
    blue: null,
    nir: null,
  });
  const [droneFile, setDroneFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSatelliteFileChange = (band, file) => {
    setSatelliteFiles((prev) => ({ ...prev, [band]: file }));
  };

  const handleDroneFileChange = (file) => {
    setDroneFile(file);
  };

  const handleReset = () => {
    setMode("satellite");
    setSatelliteFiles({ red: null, green: null, blue: null, nir: null });
    setDroneFile(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const allSatelliteFilesSelected =
    Object.values(satelliteFiles).every(Boolean);


  useEffect(() => {
    let timer;
    if (isUploading && progress < 95) {
      timer = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isUploading, progress]);

  const showUploadProgress = () => {
    setIsUploading(true);
    setProgress(0);
  };

  const hideUploadProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setIsUploading(false);
    }, 500);
  };

 const handleUploadSatellite = async () => {
  setSuccessMessage("");
  setErrorMessage("");
  showUploadProgress();

  try {
    const response = await uploadSatelliteImagery({ projectId: id, files: satelliteFiles });

    console.log("✅ Satellite Upload Response:", response); // <-- Add this log

    setSuccessMessage("✅ Satellite imagery uploaded successfully!");

    if (refreshProject) {
      refreshProject();
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  } catch (err) {
    setErrorMessage("❌ Failed to upload satellite imagery.");
    console.error("❌ Error in handleUploadSatellite:", err); // <-- More descriptive
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  } finally {
    hideUploadProgress();
  }
};


 const handleUploadDrone = async () => {
  setSuccessMessage("");
  setErrorMessage("");
  showUploadProgress();

  try {
    const response = await uploadDroneImagery({ projectId: id, file: droneFile });

    console.log("✅ Drone Upload Response:", response); // <-- Add this log

    setSuccessMessage("✅ Drone imagery uploaded successfully!");

    if (refreshProject) {
      refreshProject();
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  } catch (err) {
    setErrorMessage("❌ Failed to upload drone imagery.");
    console.error("❌ Error in handleUploadDrone:", err); // <-- More descriptive
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  } finally {
    hideUploadProgress();
  }
};

  return (
    <div className="font-sans min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-sans font-semibold mb-4 text-gray-800">
        {project ? project.title : "Loading project..."}
      </h1>

      <h2 className="text-2xl  text-gray-800 mb-6">
        Select Imagery Type
      </h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-3 font-medium">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded mb-3 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Mode selection */}
      <div className="flex gap-6 mb-6">
        {[
          { value: "satellite", label: "Satellite Imagery" },
          { value: "drone", label: "Drone Imagery" },
        ].map(({ value, label }) => (
          <label
            key={value}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition 
              ${
                mode === value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-blue-300"
              }`}
          >
            <input
              type="radio"
              name="imagery"
              value={value}
              checked={mode === value}
              onChange={() => setMode(value)}
              className="accent-blue-500"
            />
            <span className="font-medium">{label}</span>
          </label>
        ))}
      </div>

      {/* Satellite imagery form */}
      {mode === "satellite" && (
        <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
        
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Satellite Imagery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["red", "green", "blue", "nir"].map((band) => (
              <div key={band} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                  {band} Band
                </label>
                <input
                  type="file"
                  accept=".tif,.tiff"
                  onChange={(e) =>
                    handleSatelliteFileChange(band, e.target.files[0])
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleUploadSatellite}
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
                ${
                  allSatelliteFilesSelected && !isUploading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              disabled={!allSatelliteFilesSelected || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Satellite Imagery"}
            </button>
            <button
              onClick={handleReset}
              disabled={isUploading}
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition ${
                isUploading 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Drone imagery form */}
      {mode === "drone" && (
        <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Drone Imagery
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Drone TIFF
            </label>
            <input
              type="file"
              accept=".tif,.tiff"
              onChange={(e) => handleDroneFileChange(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUploadDrone}
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
                ${
                  droneFile && !isUploading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              disabled={!droneFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Drone Imagery"}
            </button>
            <button
              onClick={handleReset}
              disabled={isUploading}
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition ${
                isUploading 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Modal */}
      {isUploading && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            {/* Circle Progress */}
            <div className="relative w-40 h-40">
              {/* Background Circle */}
              <svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 36 36"
              >
                <path
                  stroke="#C1F6ED"
                  strokeOpacity="0.2"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress Arc */}
                <path
                  stroke="#3FD0C0"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              {/* Percentage in middle */}
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
                {progress}%
              </div>
            </div>

            {/* Uploading text */}
            <p className="mt-4 text-gray-700 font-medium text-sm">
              Uploading imagery...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImagery;