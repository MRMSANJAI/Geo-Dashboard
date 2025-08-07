import React, { useState } from "react";

const ImageryUpload = () => {
  const [mode, setMode] = useState("satellite");

  const [satelliteFiles, setSatelliteFiles] = useState({
    red: null,
    green: null,
    blue: null,
    nir: null,
  });

  const [droneFile, setDroneFile] = useState(null);

  const handleSatelliteFileChange = (band, file) => {
    setSatelliteFiles({ ...satelliteFiles, [band]: file });
  };

  const allSatelliteFilesSelected = Object.values(satelliteFiles).every(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Imagery Type</h1>

      {/* Radio buttons */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="imagery"
            value="satellite"
            checked={mode === "satellite"}
            onChange={() => setMode("satellite")}
          />
          <span>Satellite Imagery</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="imagery"
            value="drone"
            checked={mode === "drone"}
            onChange={() => setMode("drone")}
          />
          <span>Drone Imagery</span>
        </label>
      </div>

      {/* Satellite card */}
      <div
        className={`p-6 rounded-xl shadow-md mb-6 ${
          mode === "satellite" ? "bg-white" : "bg-gray-200 opacity-60"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Satellite Imagery</h2>
        <div className="grid grid-cols-2 gap-4">
          {["red", "green", "blue", "nir"].map((band) => (
            <div key={band}>
              <label className="block mb-1 capitalize">{band} band</label>
              <input
                type="file"
                accept=".tif,.tiff"
                onChange={(e) => handleSatelliteFileChange(band, e.target.files[0])}
                disabled={mode !== "satellite"}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
        {mode === "satellite" && allSatelliteFilesSelected && (
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upload Satellite Imagery
          </button>
        )}
      </div>

      {/* Drone card */}
      <div
        className={`p-6 rounded-xl shadow-md ${
          mode === "drone" ? "bg-white" : "bg-gray-200 opacity-60"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Drone Imagery</h2>
        <div className="mb-4">
          <label className="block mb-1">Combined Drone Image</label>
          <input
            type="file"
            accept=".tif,.tiff,.jpg,.png"
            onChange={(e) => setDroneFile(e.target.files[0])}
            disabled={mode !== "drone"}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {mode === "drone" && droneFile && (
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upload Drone Imagery
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageryUpload;