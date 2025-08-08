import React from "react";
import { useOutletContext } from "react-router-dom";
import clsx from "clsx";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import StatusIcon from "./StatusIcon.jsx";
import tagColors from "../../values/tagColours.js";



export default function ProjectOverview() {
  const { project } = useOutletContext();

  const name = project?.title ?? "Untitled Project";
  const description = project?.description ?? "No description";
  const startDate = project?.date ?? "Start date not available";
  const tags = project?.tags ?? [];
  const checklist = project?.checklist ?? [];
  const metrics = project?.metrics ?? { 
     imageryCoverage: "N/A",
     ndviHealth: "N/A",
     lulcClasses: "N/A",
     processedTiles: "N/A "
    };

  return (
    <div className="font-sans max-w-6xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl mt-5">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#02353C]">{name}</h1>
        <p className="text-sm text-gray-600">Started on: {startDate}</p>
      </div>
           <h5 className="">{description}</h5>
      {/* tags */}
      <div className="flex flex-wrap gap-2">
        {tags.length > 0
          ? tags.map((tag, idx) => (
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
          : <span className="text-gray-400 italic">No tags available</span>}
      </div>

      {/* checklist + map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-lg font-semibold mb-2 text-[#02353C]">Project Checklist</h2>
          {checklist.length > 0 ? (
            <ul className="space-y-2">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between border-b pb-1">
                  <span>{item?.item ?? "Unnamed item"}</span>
                  <StatusIcon status={item?.status} />
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 italic">No checklist items found</p>}
        </div>

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
          </MapContainer>
        </div>
      </div>

      {/* metrics */}
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
