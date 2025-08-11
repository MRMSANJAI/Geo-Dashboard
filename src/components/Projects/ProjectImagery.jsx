import React, { useState } from "react";

const ProjectImagery = () => {
  const [mode, setMode] = useState("satellite");
  const [satelliteFiles, setSatelliteFiles] = useState({
    red: null,
    green: null,
    blue: null,
    nir: null,
  });
  const [droneFile, setDroneFile] = useState(null);

  const handleSatelliteFileChange = (band, file) => {
    setSatelliteFiles(prev => ({ ...prev, [band]: file }));
  };

  const handleDroneFileChange = (file) => {
    setDroneFile(file);
  };

  const handleReset = () => {
    setMode("satellite");
    setSatelliteFiles({ red: null, green: null, blue: null, nir: null });
    setDroneFile(null);
  };

  const allSatelliteFilesSelected = Object.values(satelliteFiles).slice(0, 3).every(Boolean);

  return (
    <div className="font-sans min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Imagery Type</h1>

      {/* Mode selection */}
      <div className="flex gap-6 mb-6">
        {[
          { value: "satellite", label: "Satellite Imagery" },
          { value: "drone", label: "Drone Imagery" },
        ].map(({ value, label }) => (
          <label
            key={value}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition 
              ${mode === value ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-blue-300"}`}
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

      {/* Satellite */}
      {mode === "satellite" && (
        <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Satellite Imagery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["red", "green", "blue", "nir"].map((band) => (
              <div key={band} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                  {band} Band
                </label>
                <input
                  type="file"
                  accept=".tif,.tiff"
                  onChange={(e) => handleSatelliteFileChange(band, e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
                ${allSatelliteFilesSelected ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
              disabled={!allSatelliteFilesSelected}
            >
              Upload Satellite Imagery
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Drone */}
      {mode === "drone" && (
        <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Drone Imagery</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Drone TIFF</label>
            <input
              type="file"
              accept=".tif,.tiff"
              onChange={(e) => handleDroneFileChange(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
                ${droneFile ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
              disabled={!droneFile}
            >
              Upload Drone Imagery
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImagery;
