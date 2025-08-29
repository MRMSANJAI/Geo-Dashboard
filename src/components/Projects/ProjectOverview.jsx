import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import clsx from "clsx";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Play } from "lucide-react";
import StatusIcon from "./StatusIcon.jsx";
import tagColors from "../../values/tagColours.js";
import ip from "../../values/values.js";

const ZoomToLocation = ({ location, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(location) && location.length === 2) {
      map.setView(location, zoom);
    }
  }, [location, zoom, map]);
  return null;
};

export default function ProjectOverview() {
  
  const { project, refreshProject } = useOutletContext();
  
  const [processingItem, setProcessingItem] = useState(null);
  const [checklistState, setChecklistState] = useState(
    project?.checklist || []
  );

  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [successModal, setSuccessModal] = useState({ visible: false, message: "" });

  const [tagsState, setTagsState] = useState(project?.tags || []);

  const name = project?.title ?? "Untitled Project";
  const description = project?.description ?? "No description";
  const startDate = project?.date ?? "Start date not available";
  const tags = project?.tags ?? [];
  const location = project?.location ?? [];
  const metrics = project?.metrics ?? {
    imageryCoverage: "N/A",
    ndviHealth: "N/A",
    lulcClasses: "N/A",
    processedTiles: "N/A",
  };

  useEffect(() => {
    if (project) {
      setTagsState(project.tags || []);
      setChecklistState(project.checklist || []);
    }
  }, [project]);

  const handlePlayClick = async (item, idx) => {
    setProcessingItem(idx);
    
    try {
      if (!project?.id) {
        setErrorModal({
          visible: true,
          message: "Project ID is missing. Cannot start NDVI process.",
        });
        return;
      }

      const response = await fetch(`${ip}/api/projects/${project.id}/ndvi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorModal({
          visible: true,
          message: errorData.message || "NDVI process failed",
        });
        return;
      }

      const data = await response.json();
      console.log("NDVI response:", data);

      // Show success message
      setSuccessModal({
        visible: true,
        message: "✅ NDVI process completed successfully!"
      });

      //  Update checklist immediately (optimistic update)
      setChecklistState((prev) =>
        prev.map((checkItem, i) =>
          i === idx ? { ...checkItem, status: "active" } : checkItem
        )
      );

      // Add NDVI tag locally (optimistic update)
      if (!tagsState.includes("NDVI")) {
        setTagsState((prev) => [...prev, "NDVI"]);
      }

      //  ADD: Trigger automatic refresh to sync with server data
      if (refreshProject) {
        refreshProject();
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessModal({ visible: false, message: "" });
      }, 3000);

    } catch (error) {
      console.error("NDVI processing error:", error);
      setErrorModal({
        visible: true,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setProcessingItem(null);
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto p-5 space-y-6 bg-white shadow-xl rounded-2xl ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#02353C]">{name}</h1>
        <p className="text-sm text-gray-600">Started on: {startDate}</p>
      </div>

      <h5 className="text-gray-700">{description}</h5>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag, idx) => (
            <span
              key={idx}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-normal transition-colors duration-300",
                tagColors[tag] || "bg-gray-300 text-black"
              )}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-400 italic">No tags available</span>
        )}
      </div>

      {/* Checklist + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-[#02353C]">
            Project Checklist
          </h2>
          {checklistState.length > 0 ? (
            <ul className="space-y-2">
              {checklistState.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-2">
                    <span>{item?.item ?? "Unnamed item"}</span>

                    {/* Play button only if NDVI and tags contain AOI & Imagery */}
                    {item?.item?.toLowerCase().includes("ndvi") &&
                      tagsState.includes("AOI") &&
                      tagsState.includes("Imagery") &&
                      !tagsState.includes("NDVI") && // Hide button if NDVI tag already exists
                      item.status !== "active" && ( // Also hide if checklist is active
                        <button
                          onClick={() => handlePlayClick(item, idx)}
                          disabled={processingItem === idx}
                          className="p-1 rounded-full bg-[#2EAF7D] text-white hover:bg-[#24986b] transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Run NDVI Analysis"
                        >
                          {processingItem === idx ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                      )}
                  </div>

                  {/* Status icon */}
                  <StatusIcon status={item?.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No checklist items found
            </p>
          )}
        </div>

        {/* Map */}
        <div className="bg-gray-50 p-2 rounded-lg shadow-inner h-[300px] md:h-[400px]">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={4}
            scrollWheelZoom={false}
            className="w-full h-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location.length > 0 && (
              <>
                <ZoomToLocation location={location} zoom={12} />
                <Marker position={location}>
                  <Popup>Project Location</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <MetricCard label="Imagery Coverage" value={metrics.imageryCoverage} />
        <MetricCard label="NDVI Health" value={metrics.ndviHealth} />
        <MetricCard label="LULC Classes" value={metrics.lulcClasses} />
        <MetricCard label="Processed Tiles" value={metrics.processedTiles} />
      </div>

      {/* Success Modal */}
      {successModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-700">{successModal.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSuccessModal({ visible: false, message: "" })}
                className="bg-[#2EAF7D] text-white px-4 py-2 rounded hover:bg-[#24986b] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border-l-4 border-red-500">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{errorModal.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setErrorModal({ visible: false, message: "" })}
                className="bg-[#2EAF7D] text-white px-4 py-2 rounded hover:bg-[#24986b] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-[#F0FBF7] p-4 rounded-lg shadow">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-[#2EAF7D]">{value}</p>
    </div>
  );
}