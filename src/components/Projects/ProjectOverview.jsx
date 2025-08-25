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
  const { project } = useOutletContext();
  const [processingItem, setProcessingItem] = useState(null);
  const [checklistState, setChecklistState] = useState(
    project?.checklist || []
  );

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
        console.error("Project ID is missing");
        return;
      }

      const response = await fetch(`${ip}/api/projects/${project.id}/ndvi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("NDVI process failed");

      const data = await response.json();
      console.log("NDVI response:", data);

      // ✅ Update checklist immediately
      setChecklistState((prev) =>
        prev.map((checkItem, i) =>
          i === idx ? { ...checkItem, status: "active" } : checkItem
        )
      );

      // ✅ Add NDVI tag locally if missing
      if (!tagsState.includes("NDVI")) {
        setTagsState((prev) => [...prev, "NDVI"]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingItem(null);
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl mt-5">
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
                      !tagsState.includes("NDVI") && // ✅ Hide button if NDVI tag already exists
                      item.status !== "active" && ( // ✅ Also hide if checklist is active
                        <button
                          onClick={() => handlePlayClick(item, idx)}
                          disabled={processingItem === idx}
                          className="p-1 rounded-full bg-[#2EAF7D] text-white hover:bg-[#24986b] transition disabled:opacity-50"
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
