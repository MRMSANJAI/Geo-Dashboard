import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import * as toGeoJSON from "@tmcw/togeojson";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import { uploadAoi } from "../../services/uploadAoiApi";
import { useParams, useOutletContext } from "react-router-dom";
import { getAoi } from "../../services/getAoiApi";
import { fetchProjectById } from "../../services/projectsDetailsApi.js"; 


const FitBounds = ({ geoJson }) => {
  const map = useMap();

  React.useEffect(() => {
    if (geoJson) {
      const layer = L.geoJSON(geoJson);
      map.fitBounds(layer.getBounds());
    }
  }, [geoJson, map]);

  return null;
};

export default function ProjectAOI() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjectById(id);
      setProject(data);
    };
    loadProject();
  }, [id]);

  const { pid } = useParams();
  const { refreshProject } = useOutletContext();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [uploadedLayer, setUploadedLayer] = useState(null);
  const mapRef = useRef();
  const fileRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [aoiFile, setAoiFile] = useState(null);
  const [aoiFileGeojson, setAoiFileGeojson] = useState("");

  const handleKmlUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".kml")) {
      alert("Please upload a valid .kml file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const parser = new DOMParser();
      const kml = parser.parseFromString(e.target.result, "text/xml");
      const converted = toGeoJSON.kml(kml);
      setGeoJsonData(converted);
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    if (!geoJsonData) {
      alert("Please select a KML file first.");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await uploadAoi({
        projectId: pid,
        geoJSON: geoJsonData,
      });

      console.log("AOI Uploaded:", result);

      // ✅ Show success first
      setSuccessMessage("✅ AOI Uploaded successfully!");

      // ✅ Trigger refresh in the background (don’t block UI)
      if (refreshProject) {
        refreshProject();
      }

      // Close modal after 2s
      setTimeout(() => {
        setSuccessMessage("");
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      setErrorMessage("❌ Failed to upload.");
      console.error("Failed to upload AOI:", err);

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGeoJsonData(null);
    setUploadedLayer(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (pid) {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getAoi({ id: pid });
          setAoiFile(res);

          if (res && res.length > 0) {
            const fileUrl = res[0].file; // This is the GeoJSON file URL

            // Fetch the file content
            const geojsonResponse = await fetch(fileUrl);
            const geojsonData = await geojsonResponse.json();

            // Store the GeoJSON data
            setAoiFileGeojson(geojsonData);
          }
        } catch (error) {
          console.error("Error fetching AOI data:", error);
        }
      };

      fetchData();
    }, [pid]);
  }

  return (
    <>
      {" "}
      <h2 className="text-2xl font-sans font-semibold mb-4 text-gray-800">
        {project ? project.title : "Loading project..."}
      </h2>
      <div className="flex flex-col font-sans gap-4 px-8 h-100% bg-gray-100 rounded-lg shadow-inner p-4">
        {/* Modal */}

        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm z-index-40">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 shadow-xl relative">
              <h2 className="text-lg font-semibold mb-4">Upload AOI</h2>
              {isLoading && (
                <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded mb-2 text-sm">
                  🔃 Uploading AOI...
                </div>
              )}

              {successMessage && (
                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-2 text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded mb-2 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <p>Are you sure, You want to upload the AOI?</p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
          <input
            type="file"
            accept=".kml"
            onChange={handleKmlUpload}
            ref={fileRef}
            className="w-55 text-sm text-gray-700  bg-white border border-[#22a9e7] px-2 py-2 rounded-xl cursor-pointer transition duration-200 hover:bg-[#2EA7E0]/10"
          />
          <div className="flex gap-2 rounded-md">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!geoJsonData}
              className={`px-4 py-2 rounded text-white ${
                geoJsonData
                  ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Upload to Server
            </button>

            <button
              onClick={handleClear}
              disabled={!geoJsonData}
              className={`px-4 py-2 rounded text-white ${
                geoJsonData
                  ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                  : "bg-red-300 cursor-not-allowed"
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="z-index-0">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "75vh", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {aoiFileGeojson && (
              <>
                <FitBounds geoJson={aoiFileGeojson} />
                <GeoJSONComponent data={aoiFileGeojson} />
              </>
            )}
            {geoJsonData && (
              <>
                <FitBounds geoJson={geoJsonData} />
                <GeoJSONComponent data={geoJsonData} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

const GeoJSONComponent = ({ data }) => {
  const map = useMap();

  React.useEffect(() => {
    const layer = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.name || "Feature";
        layer.bindPopup(name);
      },
      style: {
        color: "#2EAF7D",
        weight: 2,
        opacity: 1,
      },
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [data, map]);

  return null;
};
