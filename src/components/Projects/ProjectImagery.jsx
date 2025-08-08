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
    setSatelliteFiles({ ...satelliteFiles, [band]: file });
  };

  const allSatelliteFilesSelected =
    Object.values(satelliteFiles).every(Boolean);

  // Reset function
  const handleReset = () => {
    setMode("satellite"); // If you want to always go back to Satellite
    setSatelliteFiles({
      red: null,
      green: null,
      blue: null,
      nir: null,
    });
    setDroneFile(null);

    // Reset input file elements
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100 p-6 rounded-lg shadow-initial">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Select Imagery Type
      </h1>

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
      {mode === "satellite" && (
        <div className="p-6 rounded-xl shadow-md mb-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Satellite Imagery</h2>
          <div className="grid grid-cols-2 gap-4">
            {["red", "green", "blue", "nir"].map((band) => (
              <div key={band}>
                <label className="block mb-1 capitalize">{band} band</label>
                <input
                  type="file"
                  accept=".tif,.tiff"
                  onChange={(e) =>
                    handleSatelliteFileChange(band, e.target.files[0])
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className={`px-4 py-2 text-white rounded ${
                allSatelliteFilesSelected
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!allSatelliteFilesSelected}
            >
              Upload Satellite Imagery
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {mode === "drone" && (
        <div className="p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Drone Imagery</h2>
          <div className="mb-4">
            <label className="block mb-1">Combined Drone Image</label>
            <input
              type="file"
              accept=".tif,.tiff,.jpg,.png"
              onChange={(e) => setDroneFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button className={`px-4 py-2 text-white rounded ${droneFile
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!droneFile}
            >
              Upload Drone Imagery
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImagery;
