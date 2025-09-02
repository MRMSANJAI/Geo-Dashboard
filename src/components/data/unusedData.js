 {/* <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
        >
          {Object.keys(locationOptions).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select> */}


        {/* City marker */}
            {/* <Marker position={center} icon={icon}>
          <Popup>{selectedCity} Location</Popup>
        </Marker> */}


          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
       
        {/* {mapData && (
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
          >
            <option value="0">All Projects</option>
            {Array.from(new Set(mapData.map((project) => project.title))).map(
              (project, index) => (
                <option key={project} value={index}>
                  {project}
                </option>
              )
            )}
          </select>
        )} */}

        <input
          type="file"
          accept=".kml,.geojson,.json"
          onChange={handleFileUpload}
          className="text-sm text-[#333333] bg-white border border-[#2EA7E0] px-3 py-2 rounded-md cursor-pointer transition duration-200 hover:bg-[#2EA7E0]/10"
        />
      </div>





//import React, { useRef, useState } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import * as toGeoJSON from '@tmcw/togeojson';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const FitBounds = ({ geoJson }) => {
//   const map = useMap();

//   React.useEffect(() => {
//     if (geoJson) {
//       const layer = L.geoJSON(geoJson);
//       map.fitBounds(layer.getBounds());
//     }
//   }, [geoJson, map]);

//   return null;
// };

// const KMLMap = () => {
//   const [geoJsonData, setGeoJsonData] = useState(null);
//   const [uploadedLayer, setUploadedLayer] = useState(null);
//   const mapRef = useRef();
//   const fileRef = useRef();

//   const handleKmlUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file || !file.name.endsWith('.kml')) {
//       alert('Please upload a valid .kml file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const parser = new DOMParser();
//       const kml = parser.parseFromString(e.target.result, 'text/xml');
//       const converted = toGeoJSON.kml(kml);
//       setGeoJsonData(converted);
//     };
//     reader.readAsText(file);
//   };

//   const handleConfirmUpload = () => {
//     if (!geoJsonData) {
//       alert("Please select a KML file first.");
//       return;
//     }

//     const confirmUpload = window.confirm("Are you sure you want to upload this file to the server?");
//     if (confirmUpload) {
//       // ✅ API call placeholder
//       alert("KML file uploaded to backend!");
//     }
//   };

//   const handleClear = () => {
//     setGeoJsonData(null);
//     setUploadedLayer(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   return (
//     <div className="flex flex-col gap-4 px-4 h-100% mt-5">
//       {/* Buttons */}
//       <div className="flex gap-4">
//         <input
//           type="file"
//           accept=".kml"
//           onChange={handleKmlUpload}
//           ref={fileRef}
//           className="text-sm text-gray-700"
//         />
//         <button
//           onClick={handleConfirmUpload}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Upload to Server
//         </button>
//         <button
//           onClick={handleClear}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Map */}
//       <MapContainer
//         center={[20.5937, 78.9629]}
//         zoom={5}
//         style={{  height: "75vh", width: "100%" }}
//         ref={mapRef}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; OpenStreetMap contributors'
//         />

//         {geoJsonData && (
//           <>
//             <FitBounds geoJson={geoJsonData} />
//             <GeoJSONComponent data={geoJsonData} />
//           </>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// const GeoJSONComponent = ({ data }) => {
//   const map = useMap();

//   React.useEffect(() => {
//     const layer = L.geoJSON(data, {
//       onEachFeature: (feature, layer) => {
//         const name = feature?.properties?.name || "Feature";
//         layer.bindPopup(name);
//       },
//       style: {
//         color: "#2EAF7D",
//         weight: 2,
//         opacity: 1,
//       },
//     });

//     layer.addTo(map);

//     return () => {
//       map.removeLayer(layer);
//     };
//   }, [data, map]);

//   return null;
// };

// export default KMLMap;  for the KMLMap component





// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchProjectById } from "../services/projectsDetailsApi";
// import StatusIcon from "../components/Projects/StatusIcon";
// import clsx from "clsx";
// import tagColors from "../values/tagColours.js";
// import ProjectSidebar from "../components/Projects/ProjectSidebar.jsx";

// const ProjectDetailPage = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProjectById(id).then((data) => {
//       setProject(data);
//       setLoading(false);
//     });
//   }, [id]);

//   return (
//     <div className="flex h-screen">
//       <ProjectSidebar />

//       <div className="flex-1 bg-[#C1F6ED]/20 p-6">
//         {loading ? (
//           <p className="text-center text-gray-500 mt-10">
//             Loading project details...
//           </p>
//         ) : (
//           <ProjectOverview project={project} />
//         )}
//       </div>
//     </div>
//   );
// };

// const ProjectOverview = ({ project }) => {
//   const name = project?.title ?? "Untitled Project";
//   const description = project?.description ?? "Untitled Project";
//   const startDate = project?.date ?? "Start date not available";
//   const tags = project?.tags ?? [];
//   const checklist = project?.checklist ?? ["NDVI"];
//   const metrics = project?.metrics ?? {
//     imageryCoverage: "N/A",
//     ndviHealth: "N/A",
//     lulcClasses: "N/A",
//     processedTiles: "N/A",
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl mt-10">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-[#02353C]">{name}</h1>
//         <p className="text-sm text-gray-600">Started on: {startDate}</p>
//       </div>

//       {/* Tags */}
//       <div className="flex flex-wrap gap-2">
//         {tags.length > 0 ? (
//           tags.map((tag, idx) => (
//             <span
//               key={idx}
//               className={clsx(
//                 "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300",
//                 tagColors[tag] || "bg-gray-300 text-black"
//               )}
//             >
//               {tag}
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-400 italic">No tags available</span>
//         )}
//       </div>

//       {/* Checklist */}
//       <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//         <h2 className="text-lg font-semibold mb-2 text-[#02353C]">
//           Project Checklist
//         </h2>
//         {checklist.length > 0 ? (
//           <ul className="space-y-2">
//             {checklist.map((item, idx) => (
//               <li
//                 key={idx}
//                 className="flex items-center justify-between border-b pb-1"
//               >
//                 <span>{item?.item ?? "Unnamed item"}</span>
//                 <StatusIcon status={item?.status} />
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-500 italic">
//             No checklist items found
//           </p>
//         )}
//       </div>

//       {/* Metrics */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//         <MetricCard label="Imagery Coverage" value={metrics.imageryCoverage} />
//         <MetricCard label="NDVI Health" value={metrics.ndviHealth} />
//         <MetricCard label="LULC Classes" value={metrics.lulcClasses} />
//         <MetricCard label="Processed Tiles" value={metrics.processedTiles} />
//       </div>
//     </div>
//   );
// };

// // Subcomponent: Metric Card
// const MetricCard = ({ label, value }) => (
//   <div className="bg-[#F0FBF7] p-4 rounded-lg shadow">
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="text-lg font-bold text-[#2EAF7D]">{value}</p>
//   </div>
// );

// export default ProjectDetailPage;   project detail page component



                              //  PROJECT OVERVIEW    before ndvi process

// import React from "react";
// import { useOutletContext } from "react-router-dom";
// import clsx from "clsx";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useEffect } from "react";
// import { Play } from "lucide-react"; // Play icon
// import StatusIcon from "./StatusIcon.jsx";
// import tagColors from "../../values/tagColours.js";

// const ZoomToLocation = ({ location, zoom = 14 }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (Array.isArray(location) && location.length === 2) {
//       map.setView(location, zoom);
//     }
//   }, [location, zoom, map]);

//   return null;
// };

// export default function ProjectOverview() {
//   const { project } = useOutletContext();

//   const name = project?.title ?? "Untitled Project";
//   const description = project?.description ?? "No description";
//   const startDate = project?.date ?? "Start date not available";
//   const tags = project?.tags ?? [];
//   const checklist = project?.checklist ?? [];
//   const location = project?.location ?? [];
//   const metrics = project?.metrics ?? {
//     imageryCoverage: "N/A",
//     ndviHealth: "N/A",
//     lulcClasses: "N/A",
//     processedTiles: "N/A",
//   };

//   // Handle play button click for NDVI
//   const handlePlayClick = (item) => {
//     console.log(`Play NDVI analysis for: ${item?.item}`);
//     alert(`Playing NDVI analysis for: ${item?.item}`);
//   };

//   return (
//     <div className="font-sans max-w-6xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-2xl mt-5">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-[#02353C]">{name}</h1>
//         <p className="text-sm text-gray-600">Started on: {startDate}</p>
//       </div>

//       <h5 className="text-gray-700">{description}</h5>

//       {/* Tags */}
//       <div className="flex flex-wrap gap-2">
//         {tags.length > 0 ? (
//           tags.map((tag, idx) => (
//             <span
//               key={idx}
//               className={clsx(
//                 "px-3 py-1 rounded-full text-sm font-normal transition-colors duration-300",
//                 tagColors[tag] || "bg-gray-300 text-black"
//               )}
//             >
//               {tag}
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-400 italic">No tags available</span>
//         )}
//       </div>

//       {/* Checklist + Map */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//           <h2 className="text-lg font-semibold mb-2 text-[#02353C]">
//             Project Checklist
//           </h2>
//           {checklist.length > 0 ? (
//             <ul className="space-y-2">
//               {checklist.map((item, idx) => (
//                 <li
//                   key={idx}
//                   className="flex items-center justify-between border-b pb-1"
//                 >
//                   <span>{item?.item ?? "Unnamed item"}</span>
//                   <div className="flex items-center gap-2">
//                     {/* Show play button only if NDVI and project has AOI & Imagery tags */}

//                     {item?.item?.toLowerCase().includes("ndvi") &&
//                       tags.includes("AOI") &&
//                       tags.includes("Imagery") && (
//                         <button
//                           onClick={() => handlePlayClick(item)}
//                           className="p-1 rounded-full bg-[#2EAF7D] text-white hover:bg-[#24986b] transition"
//                           title="Play NDVI Analysis"
//                         >
//                           <Play size={16} />
//                         </button>
//                       )}

//                     <StatusIcon status={item?.status} />
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-500 italic">
//               No checklist items found
//             </p>
//           )}
//         </div>

//         <div className="bg-gray-50 p-2 rounded-lg shadow-inner h-[300px] md:h-[400px]">
//           <MapContainer
//             center={[20.5937, 78.9629]}
//             zoom={4}
//             scrollWheelZoom={false}
//             className="w-full h-full rounded-lg"
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {location.length > 0 && (
//               <>
//                 <ZoomToLocation location={location} zoom={12} />
//                 <Marker position={location}>
//                   <Popup>Project Location</Popup>
//                 </Marker>
//               </>
//             )}
//           </MapContainer>
//         </div>
//       </div>

//       {/* Metrics */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//         <MetricCard label="Imagery Coverage" value={metrics.imageryCoverage} />
//         <MetricCard label="NDVI Health" value={metrics.ndviHealth} />
//         <MetricCard label="LULC Classes" value={metrics.lulcClasses} />
//         <MetricCard label="Processed Tiles" value={metrics.processedTiles} />
//       </div>
//     </div>
//   );
// }

// function MetricCard({ label, value }) {
//   return (
//     <div className="bg-[#F0FBF7] p-4 rounded-lg shadow">
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="text-lg font-bold text-[#2EAF7D]">{value}</p>
//     </div>
//   );
// }


LULC 
// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";

// const LULC_CLASSES = [
//   { id: "agriculture", label: "Agriculture", color: "#84cc16" },
//   { id: "water", label: "Water", color: "#0ea5e9" },
//   { id: "forest", label: "Forest", color: "#15803d" },
//   { id: "builtup", label: "Built-up", color: "#f97316" },
//   { id: "barren", label: "Barren", color: "#a8a29e" },
// ];

// const CDN = {
//   leafletCss: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
//   leafletJs: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
//   leafletDrawCss: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css",
//   leafletDrawJs: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js",
// };

// export default function LULCMap() {
//   const { id } = useParams();
//   const containerRef = useRef(null);
//   const mapRef = useRef(null);
//   const drawnRef = useRef(null);
//   const controlRef = useRef(null);
//   const cleanupRef = useRef(null);
//   const selectedClassIdRef = useRef(LULC_CLASSES[0].id);
//   const isMapInitialized = useRef(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedClassId, setSelectedClassId] = useState(LULC_CLASSES[0].id);
//   const [polygonsList, setPolygonsList] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [wmsLoaded, setWmsLoaded] = useState(false);

//   function addCss(href) {
//     if (typeof document === "undefined") return;
//     const exists = Array.from(
//       document.querySelectorAll('link[rel="stylesheet"]')
//     ).some((l) => l.href === href);
//     if (!exists) {
//       const link = document.createElement("link");
//       link.rel = "stylesheet";
//       link.href = href;
//       document.head.appendChild(link);
//     }
//   }

//   function addScript(src) {
//     return new Promise((resolve, reject) => {
//       if (typeof document === "undefined")
//         return reject(new Error("document not found"));
//       const existing = Array.from(document.getElementsByTagName("script")).find(
//         (s) => s.src === src
//       );
//       if (existing) {
//         if (existing.getAttribute("data-loaded") === "true") return resolve();
//         existing.addEventListener("load", () => resolve());
//         existing.addEventListener("error", () =>
//           reject(new Error("Failed to load " + src))
//         );
//         return;
//       }
//       const s = document.createElement("script");
//       s.src = src;
//       s.async = true;
//       s.onload = () => {
//         s.setAttribute("data-loaded", "true");
//         resolve();
//       };
//       s.onerror = () => reject(new Error("Failed to load " + src));
//       document.head.appendChild(s);
//     });
//   }

//   // Update the ref whenever selectedClassId changes
//   useEffect(() => {
//     selectedClassIdRef.current = selectedClassId;
//   }, [selectedClassId]);

//   // Helper function to create drawing control
//   function createDrawingControl(map, drawnItems, color) {
//     const L = window.L;
//     return new L.Control.Draw({
//       draw: {
//         polyline: false,
//         polygon: {
//           allowIntersection: false,
//           showArea: true,
//           shapeOptions: {
//             color,
//             weight: 2,
//             fillOpacity: 0.4,
//             fillColor: color,
//           },
//         },
//         circle: false,
//         rectangle: false,
//         marker: false,
//         circlemarker: false,
//       },
//       edit: { featureGroup: drawnItems, edit: true, remove: true },
//     });
//   }

//   // Helper function to setup map events and controls
//   function setupMapControls(map, drawnItems) {
//     const L = window.L;

//     // Create initial control
//     const cls =
//       LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
//       LULC_CLASSES[0];
//     const control = createDrawingControl(map, drawnItems, cls.color);
//     controlRef.current = control;
//     map.addControl(control);

//     function refreshList() {
//       const list = [];
//       drawnItems.eachLayer((layer) => {
//         const feature = layer.toGeoJSON();
//         const id =
//           layer._customId ||
//           (feature && feature.id) ||
//           `${Math.random().toString(36).slice(2, 9)}`;
//         if (!layer._customId) layer._customId = id;
//         const props = (feature && feature.properties) || {};
//         list.push({ id, props, layer });
//       });
//       setPolygonsList(list);
//     }

//     // Setup drawing events
//     map.on(L.Draw.Event.CREATED, (e) => {
//       const layer = e.layer;
//       const id = `poly_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
//       layer._customId = id;
//       const geo = layer.toGeoJSON();
//       geo.properties = geo.properties || {};
//       geo.properties.lulc_class = selectedClassIdRef.current;
//       layer.feature = geo;

//       const selectedCls =
//         LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
//         LULC_CLASSES[0];

//       if (layer.setStyle) {
//         layer.setStyle({
//           color: selectedCls.color,
//           weight: 2,
//           fillOpacity: 0.4,
//           fillColor: selectedCls.color,
//         });
//       }

//       drawnItems.addLayer(layer);
//       refreshList();
//     });

//     map.on(L.Draw.Event.EDITED, (e) => {
//       e.layers.eachLayer((layer) => {
//         if (layer.feature) {
//           layer.feature.geometry = layer.toGeoJSON().geometry;
//         } else {
//           layer.feature = layer.toGeoJSON();
//         }
//       });
//       refreshList();
//     });

//     map.on(L.Draw.Event.DELETED, () => refreshList());

//     return { refreshList };
//   }

//   // Main initialization effect
//   useEffect(() => {
//     let canceled = false;

//     async function init() {
//       if (typeof window === "undefined" || typeof document === "undefined")
//         return;
//       if (isMapInitialized.current) return;

//       try {
//         setLoading(true);
//         addCss(CDN.leafletCss);
//         addCss(CDN.leafletDrawCss);

//         await addScript(CDN.leafletJs);
//         await addScript(CDN.leafletDrawJs);

//         const L = window.L;
//         if (!L || !L.Control || !L.Control.Draw)
//           throw new Error("Leaflet or Leaflet.draw not available");

//         // const map = L.map(containerRef.current, { zoomControl: true }).setView(
//         //   [11.0, 78.0],
//         //   7
//         // );

//         // // Add base tile layer
//         // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         //   maxZoom: 19,
//         //   attribution:
//         //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         // }).addTo(map);

//         // // Initialize drawing layers
//         // const drawnItems = new L.FeatureGroup();
//         // drawnRef.current = drawnItems;
//         // map.addLayer(drawnItems);

//         const map = L.map(containerRef.current, { zoomControl: true }).setView([11.0, 78.0], 7);

// // Define base layers
// const baseLayers = {
//   "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   }),
//   "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//     attribution: 'Tiles &copy; Esri'
//   }),
//   "Carto Light": L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
//     attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
//   })
// };

// const overlayLayers = {
//   "Labels": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors'
//   })
// };

// // Add default layer
// baseLayers["OpenStreetMap"].addTo(map);

// // Add layer control
// const layerControl = L.control.layers(baseLayers, overlayLayers, { collapsed: true }).addTo(map);

// // Initialize drawing layers
// const drawnItems = new L.FeatureGroup();
// drawnRef.current = drawnItems;
// map.addLayer(drawnItems);

//         // Setup drawing controls and events
//         const { refreshList } = setupMapControls(map, drawnItems);

//         mapRef.current = map;
//         isMapInitialized.current = true;

//         // Now fetch WMS layer data AFTER map is fully initialized
//         try {
//           const response = await fetch(
//             `http://192.168.29.152:8000/api/projects/${id}/rasters/`
//           );
//           const data = await response.json();

//           const layerData = Array.isArray(data) ? data[data.length - 1] : data;

//           if (layerData && layerData.wms_url) {
//             const wmsUrl = layerData.wms_url.split("?")[0];
//             const layerName = `${layerData.workspace}:${layerData.layer_name}`;

//             // const wmsLayer = L.tileLayer.wms(wmsUrl, {
//             //   layers: layerName,
//             //   format: "image/png",
//             //   transparent: true,
//             //   version: "1.1.0",
//             //   attribution: "WMS Layer",
//             // });

//              const wmsLayer = L.tileLayer.wms(wmsUrl, {
//   layers: layerName,
//   format: "image/png",
//   transparent: true,
//   version: "1.1.0",
//   attribution: "WMS Layer"
// });

// wmsLayer.addTo(map);
// overlayLayers["WMS Layer"] = wmsLayer;
// layerControl.addOverlay(wmsLayer, "WMS Layer");

//             wmsLayer.addTo(map);
//             setWmsLoaded(true);

//             if (
//               layerData.bbox_minx !== undefined &&
//               layerData.bbox_miny !== undefined &&
//               layerData.bbox_maxx !== undefined &&
//               layerData.bbox_maxy !== undefined
//             ) {
//               map.fitBounds([
//                 [layerData.bbox_miny, layerData.bbox_minx],
//                 [layerData.bbox_maxy, layerData.bbox_maxx],
//               ]);
//             }
//           }
//         } catch (wmsError) {
//           console.error("Error fetching WMS data:", wmsError);
//           setWmsLoaded(true);
//         }
//         cleanupRef.current = () => {
//           try {
//             if (map) {
//               map.off();
//               if (controlRef.current) {
//                 map.removeControl(controlRef.current);
//               }
//               drawnItems.clearLayers();
//               map.remove();
//             }
//           } catch (err) {
//             console.error("Cleanup error:", err);
//           }
//         };

//         if (!canceled) {
//           setLoading(false);
//         }
//       } catch (err) {
//         if (!canceled) {
//           setError(String(err && err.message ? err.message : err));
//           setLoading(false);
//         }
//       }
//     }

//     init();

//     return () => {
//       canceled = true;
//       isMapInitialized.current = false;
//       try {
//         if (cleanupRef.current) {
//           cleanupRef.current();
//         }
//       } catch (err) {
//         console.error("Cleanup error:", err);
//       }
//     };
//   }, []);

//   // Handle class selection changes - only update control, don't recreate map
//   useEffect(() => {
//     if (!mapRef.current || !controlRef.current || !isMapInitialized.current)
//       return;

//     const L = window.L;
//     const cls =
//       LULC_CLASSES.find((c) => c.id === selectedClassId) || LULC_CLASSES[0];

//     try {
//       // Remove old control
//       mapRef.current.removeControl(controlRef.current);

//       // Create new control with updated color
//       const newControl = createDrawingControl(
//         mapRef.current,
//         drawnRef.current,
//         cls.color
//       );
//       controlRef.current = newControl;

//       // Add new control
//       mapRef.current.addControl(newControl);
//     } catch (err) {
//       console.error("Error updating drawing control:", err);
//     }
//   }, [selectedClassId]);

//   // Handle editing state changes
//   useEffect(() => {
//     if (!drawnRef.current) return;

//     drawnRef.current.eachLayer((layer) => {
//       try {
//         if (layer._customId === editingId) {
//           if (layer.editing && layer.editing.enable) layer.editing.enable();
//         } else {
//           if (layer.editing && layer.editing.disable) layer.editing.disable();
//         }
//       } catch (err) {
//         console.error("Error toggling layer editing:", err);
//       }
//     });

//     if (!editingId) {
//       const list = [];
//       drawnRef.current.eachLayer((layer) => {
//         const feature = layer.toGeoJSON();
//         const id =
//           layer._customId ||
//           (feature && feature.id) ||
//           `${Math.random().toString(36).slice(2, 9)}`;
//         const props = (feature && feature.properties) || {};
//         list.push({ id, props, layer });
//       });
//       setPolygonsList(list);
//     }
//   }, [editingId]);

//   function exportGeoJSON() {
//     if (!drawnRef.current) return;
//     const features = [];
//     drawnRef.current.eachLayer((layer) => {
//       const feat = layer.feature
//         ? JSON.parse(JSON.stringify(layer.feature))
//         : layer.toGeoJSON();
//       feat.properties = feat.properties || {};
//       if (!feat.properties.lulc_class)
//         feat.properties.lulc_class = "unclassified";
//       features.push(feat);
//     });
//     const fc = { type: "FeatureCollection", features };
//     const blob = new Blob([JSON.stringify(fc, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "lulc_polygons.geojson";
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   function clearAll() {
//     if (drawnRef.current) {
//       drawnRef.current.clearLayers();
//     }
//     setPolygonsList([]);
//   }

//   function removePolygon(item) {
//     if (!drawnRef.current) return;
//     let removed = false;
//     drawnRef.current.eachLayer((layer) => {
//       if (layer._customId === item.id) {
//         drawnRef.current.removeLayer(layer);
//         removed = true;
//       }
//     });
//     if (removed) {
//       setPolygonsList((prev) => prev.filter((p) => p.id !== item.id));
//     }
//   }

//   return (
//     <div
//       className="font-sans w-full flex bg-gradient-to-br from-slate-50 to-slate-100"
//       style={{ height: "calc(100vh - 60px)" }}
//     >
//       {/* Sidebar */}
//       <aside
//         className="w-94 bg-white/95 backdrop-blur-sm shadow-xl border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
//         style={{ maxHeight: "calc(100vh - 60px)" }}
//       >
//         {/* Header */}
//         <div className="space-y-2">
//           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
//             LULC Training
//           </h1>
//           <p className="text-slate-600 text-sm font-medium">
//             Create training polygons for land use classification
//           </p>
//         </div>

//         {/* Status indicator */}
//         <div
//           className={`p-3 rounded-lg border ${
//             loading
//               ? "bg-yellow-50 border-yellow-200 text-yellow-800"
//               : wmsLoaded
//               ? "bg-green-50 border-green-200 text-green-800"
//               : "bg-red-50 border-red-200 text-red-800"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-2 h-2 rounded-full ${
//                 loading
//                   ? "bg-yellow-500 animate-pulse"
//                   : wmsLoaded
//                   ? "bg-green-500"
//                   : "bg-red-500"
//               }`}
//             />
//             <span className="text-sm font-medium">
//               {loading
//                 ? "Loading map and WMS layer..."
//                 : wmsLoaded
//                 ? "Map ready - Drawing tools active"
//                 : "Map ready - WMS layer failed"}
//             </span>
//           </div>
//         </div>

//         {/* Class Selection */}
//         <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-5 border border-blue-100">
//           <label className="block text-sm font-semibold text-slate-800 mb-3">
//             Land Cover Class
//           </label>
//           <div className="space-y-2">
//             {LULC_CLASSES.map((cls) => (
//               <button
//                 key={cls.id}
//                 onClick={() => setSelectedClassId(cls.id)}
//                 disabled={loading}
//                 className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-all duration-200 border-2 ${
//                   selectedClassId === cls.id
//                     ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20 transform scale-[1.02]"
//                     : "bg-white/60 border-transparent hover:bg-white/80 hover:shadow-sm"
//                 } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <div
//                   className={`w-4 h-3 rounded-md shadow-sm transition-all duration-200 ${
//                     selectedClassId === cls.id
//                       ? "ring-3 ring-blue-500/30 scale-110"
//                       : "ring-2 ring-white/80"
//                   }`}
//                   style={{ background: cls.color }}
//                 />
//                 <span
//                   className={`font-medium text-sm text-left flex-1 transition-colors ${
//                     selectedClassId === cls.id
//                       ? "text-blue-900"
//                       : "text-slate-700"
//                   }`}
//                 >
//                   {cls.label}
//                 </span>
//                 {selectedClassId === cls.id && (
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
//                   </div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 flex-shrink-0">
//           <button
//             onClick={exportGeoJSON}
//             disabled={loading || polygonsList.length === 0}
//             className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm"
//           >
//             Export GeoJSON ({polygonsList.length})
//           </button>
//           <button
//             onClick={clearAll}
//             disabled={loading || polygonsList.length === 0}
//             className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* Guide */}
//         <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
//             <span className="font-semibold text-amber-800 text-base">
//               Quick Guide
//             </span>
//           </div>
//           <ul className="text-xs text-amber-700 space-y-2 leading-relaxed">
//             <li>• Wait for map to load completely</li>
//             <li>• Select a land cover class above</li>
//             <li>• Use the polygon tool in the map toolbar</li>
//             <li>• Draw training areas on the map</li>
//             <li>• Export when ready for ML training</li>
//           </ul>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-2 h-2 bg-red-500 rounded-full" />
//               <span className="font-medium text-red-800 text-sm">Error</span>
//             </div>
//             <div
//               className="text-red-700 text-sm"
//               style={{ whiteSpace: "pre-wrap" }}
//             >
//               {error}
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Map Container */}
//       <main className="flex-1 relative overflow-hidden">
//         {loading && (
//           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
//             <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
//               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <span className="text-slate-700 font-medium">
//                 {isMapInitialized.current
//                   ? "Loading WMS layer..."
//                   : "Initializing map..."}
//               </span>
//             </div>
//           </div>
//         )}
//         <div
//           ref={containerRef}
//           className="w-full h-full overflow-hidden shadow-2xl"
//           style={{ minHeight: 400, zIndex: 0 }}
//         />
//       </main>
//     </div>
//   );
// }

imagnery

// const ProjectImagery = () => {
//   const { id } = useParams();
//   const { refreshProject } = useOutletContext();

//   const [project, setProject] = useState(null);

//   useEffect(() => {
//     const loadProject = async () => {
//       const data = await fetchProjectById(id);
//       setProject(data);
//     };
//     loadProject();
//   }, [id]);

//   const [mode, setMode] = useState("satellite");
//   const [satelliteFiles, setSatelliteFiles] = useState({
//     red: null,
//     green: null,
//     blue: null,
//     nir: null,
//   });
//   const [droneFile, setDroneFile] = useState(null);

//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // ✅ NDVI process states
//   const [processingNDVI, setProcessingNDVI] = useState(false);
//   const [ndviSuccess, setNdviSuccess] = useState("");
//   const [ndviError, setNdviError] = useState("");

//   const handleSatelliteFileChange = (band, file) => {
//     setSatelliteFiles((prev) => ({ ...prev, [band]: file }));
//   };

//   const handleDroneFileChange = (file) => {
//     setDroneFile(file);
//   };

//   const handleReset = () => {
//     setMode("satellite");
//     setSatelliteFiles({ red: null, green: null, blue: null, nir: null });
//     setDroneFile(null);
//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   const allSatelliteFilesSelected =
//     Object.values(satelliteFiles).every(Boolean);

//   useEffect(() => {
//     let timer;
//     if (isUploading && progress < 95) {
//       timer = setInterval(() => {
//         setProgress((prev) => (prev < 95 ? prev + 5 : prev));
//       }, 300);
//     }
//     return () => clearInterval(timer);
//   }, [isUploading, progress]);

//   const showUploadProgress = () => {
//     setIsUploading(true);
//     setProgress(0);
//   };

//   const hideUploadProgress = () => {
//     setProgress(100);
//     setTimeout(() => {
//       setIsUploading(false);
//     }, 500);
//   };

//   // ✅ Upload Satellite Imagery
//   const handleUploadSatellite = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     showUploadProgress();

//     try {
//       const response = await uploadSatelliteImagery({
//         projectId: id,
//         files: satelliteFiles,
//       });
//       console.log("✅ Satellite Upload Response:", response);

//       setSuccessMessage("✅ Satellite imagery uploaded successfully!");

//       if (refreshProject) {
//         refreshProject();
//       }

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (err) {
//       setErrorMessage("❌ Failed to upload satellite imagery.");
//       console.error("❌ Error in handleUploadSatellite:", err);
//       setTimeout(() => {
//         setErrorMessage("");
//       }, 5000);
//     } finally {
//       hideUploadProgress();
//     }
//   };

//   // ✅ Upload Drone Imagery
//   const handleUploadDrone = async () => {
//     setSuccessMessage("");
//     setErrorMessage("");
//     showUploadProgress();

//     try {
//       const response = await uploadDroneImagery({
//         projectId: id,
//         file: droneFile,
//       });
//       console.log("✅ Drone Upload Response:", response);

//       setSuccessMessage("✅ Drone imagery uploaded successfully!");

//       if (refreshProject) {
//         refreshProject();
//       }

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (err) {
//       setErrorMessage("❌ Failed to upload drone imagery.");
//       console.error("❌ Error in handleUploadDrone:", err);
//       setTimeout(() => {
//         setErrorMessage("");
//       }, 5000);
//     } finally {
//       hideUploadProgress();
//     }
//   };

//   // ✅ NDVI Process Handler
//   const handleNDVIProcess = async () => {
//     setNdviSuccess("");
//     setNdviError("");
//     setProcessingNDVI(true);

//     try {
//       if (!project?.id) {
//         setNdviError("Project ID is missing. Cannot start NDVI process.");
//         return;
//       }

//       const response = await fetch(`${ip}/api/projects/${project.id}/ndvi/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setNdviError(errorData.message || "NDVI process failed");
//         return;
//       }

//       const data = await response.json();
//       console.log("NDVI response:", data);

//       setNdviSuccess("✅ NDVI process completed successfully!");

//       if (refreshProject) {
//         refreshProject();
//       }

//       setTimeout(() => {
//         setNdviSuccess("");
//       }, 3000);
//     } catch (error) {
//       console.error("NDVI processing error:", error);
//       setNdviError("An unexpected error occurred. Please try again.");
//     } finally {
//       setProcessingNDVI(false);
//     }
//   };

//   return (
//     <div className="font-sans min-h-screen bg-gray-50 p-6">
//       <h1 className="text-2xl font-sans font-semibold mb-4 text-gray-800">
//         {project ? project.title : "Loading project..."}
//       </h1>

//       <h2 className="text-2xl text-gray-800 mb-6">Select Imagery Type</h2>

//       {/* Success and Error Messages */}
//       {successMessage && (
//         <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-3 font-medium">
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded mb-3 font-medium">
//           {errorMessage}
//         </div>
//       )}
//       {ndviSuccess && (
//         <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-3 font-medium">
//           {ndviSuccess}
//         </div>
//       )}
//       {ndviError && (
//         <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded mb-3 font-medium">
//           {ndviError}
//         </div>
//       )}

//       {/* Mode selection */}
//       <div className="flex gap-6 mb-6">
//         {[
//           { value: "satellite", label: "Satellite Imagery" },
//           { value: "drone", label: "Drone Imagery" },
//         ].map(({ value, label }) => (
//           <label
//             key={value}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition 
//               ${
//                 mode === value
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300 bg-white hover:border-blue-300"
//               }`}
//           >
//             <input
//               type="radio"
//               name="imagery"
//               value={value}
//               checked={mode === value}
//               onChange={() => setMode(value)}
//               className="accent-blue-500"
//             />
//             <span className="font-medium">{label}</span>
//           </label>
//         ))}
//       </div>

//       {/* Satellite imagery form */}
//       {mode === "satellite" && (
//         <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Satellite Imagery
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {["red", "green", "blue", "nir"].map((band) => (
//               <div key={band} className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
//                   {band} Band
//                 </label>
//                 <input
//                   type="file"
//                   accept=".tif,.tiff"
//                   onChange={(e) =>
//                     handleSatelliteFileChange(band, e.target.files[0])
//                   }
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="flex gap-3 mt-6 justify-between items-center">
//             <div className="flex gap-3">
//               <button
//                 onClick={handleUploadSatellite}
//                 className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
//         ${
//           allSatelliteFilesSelected && !isUploading
//             ? "bg-blue-600 hover:bg-blue-700"
//             : "bg-gray-300 cursor-not-allowed"
//         }`}
//                 disabled={!allSatelliteFilesSelected || isUploading}
//               >
//                 {isUploading ? "Uploading..." : "Upload Satellite Imagery"}
//               </button>
//               <button
//                 onClick={handleReset}
//                 disabled={isUploading}
//                 className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition ${
//                   isUploading
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-red-500 hover:bg-red-600"
//                 }`}
//               >
//                 Reset
//               </button>
//             </div>

//             {/* ✅ NDVI Process Button */}
//             <button
//               onClick={handleNDVIProcess}
//               disabled={processingNDVI}
//               className={`px-6 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition ${
//                 processingNDVI
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {processingNDVI ? "Processing..." : "NDVI Process"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Drone imagery form */}
//       {mode === "drone" && (
//         <div className="p-6 rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Drone Imagery
//           </h2>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Drone TIFF
//             </label>
//             <input
//               type="file"
//               accept=".tif,.tiff"
//               onChange={(e) => handleDroneFileChange(e.target.files[0])}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>
//           <div className="flex gap-3 mt-4 justify-between items-center">
//             <div className="flex gap-3">
//               <button
//                 onClick={handleUploadDrone}
//                 className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition 
//         ${
//           droneFile && !isUploading
//             ? "bg-blue-600 hover:bg-blue-700"
//             : "bg-gray-300 cursor-not-allowed"
//         }`}
//                 disabled={!droneFile || isUploading}
//               >
//                 {isUploading ? "Uploading..." : "Upload Drone Imagery"}
//               </button>
//               <button
//                 onClick={handleReset}
//                 disabled={isUploading}
//                 className={`px-5 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition ${
//                   isUploading
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-red-500 hover:bg-red-600"
//                 }`}
//               >
//                 Reset
//               </button>
//             </div>

//             {/* ✅ NDVI Process Button */}
//             <button
//               onClick={handleNDVIProcess}
//               disabled={processingNDVI}
//               className={`px-6 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition ${
//                 processingNDVI
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {processingNDVI ? "Processing..." : "NDVI Process"}
//             </button>
//           </div>
//         </div>
//       )}
//       {/* Upload Progress Modal */}
//       {isUploading && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
//             <div className="relative w-40 h-40">
//               <svg
//                 className="absolute top-0 left-0 w-full h-full"
//                 viewBox="0 0 36 36"
//               >
//                 <path
//                   stroke="#C1F6ED"
//                   strokeOpacity="0.2"
//                   strokeWidth="3"
//                   fill="none"
//                   strokeLinecap="round"
//                   d="M18 2.0845
//                    a 15.9155 15.9155 0 0 1 0 31.831
//                    a 15.9155 15.9155 0 0 1 0 -31.831"
//                 />
//                 <path
//                   stroke="#3FD0C0"
//                   strokeWidth="3"
//                   fill="none"
//                   strokeLinecap="round"
//                   className="transition-all duration-300 ease-out"
//                   strokeDasharray={`${progress}, 100`}
//                   d="M18 2.0845
//                    a 15.9155 15.9155 0 0 1 0 31.831
//                    a 15.9155 15.9155 0 0 1 0 -31.831"
//                 />
//               </svg>
//               <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
//                 {progress}%
//               </div>
//             </div>
//             <p className="mt-4 text-gray-700 font-medium text-sm">
//               Uploading imagery...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";

// const LULC_CLASSES = [
//   { id: "agriculture", label: "Agriculture", color: "#84cc16" },
//   { id: "water", label: "Water", color: "#0ea5e9" },
//   { id: "forest", label: "Forest", color: "#15803d" },
//   { id: "builtup", label: "Built-up", color: "#f97316" },
//   { id: "barren", label: "Barren", color: "#a8a29e" },
// ];

// const CDN = {
//   leafletCss: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
//   leafletJs: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
//   leafletDrawCss: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css",
//   leafletDrawJs: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js",
// };

// export default function LULCPage() {
//   const { id } = useParams();
//   const containerRef = useRef(null);
//   const mapRef = useRef(null);
//   const drawnRef = useRef(null);
//   const controlRef = useRef(null);
//   const cleanupRef = useRef(null);
//   const selectedClassIdRef = useRef(LULC_CLASSES[0].id);
//   const isMapInitialized = useRef(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedClassId, setSelectedClassId] = useState(LULC_CLASSES[0].id);
//   const [polygonsList, setPolygonsList] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [wmsLoaded, setWmsLoaded] = useState(false);
//   const [exportStatus, setExportStatus] = useState({
//     loading: false,
//     success: false,
//     error: null,
//   });

//   function addCss(href) {
//     if (typeof document === "undefined") return;
//     const exists = Array.from(
//       document.querySelectorAll('link[rel="stylesheet"]')
//     ).some((l) => l.href === href);
//     if (!exists) {
//       const link = document.createElement("link");
//       link.rel = "stylesheet";
//       link.href = href;
//       document.head.appendChild(link);
//     }
//   }

//   function addScript(src) {
//     return new Promise((resolve, reject) => {
//       if (typeof document === "undefined")
//         return reject(new Error("document not found"));
//       const existing = Array.from(document.getElementsByTagName("script")).find(
//         (s) => s.src === src
//       );
//       if (existing) {
//         if (existing.getAttribute("data-loaded") === "true") return resolve();
//         existing.addEventListener("load", () => resolve());
//         existing.addEventListener("error", () =>
//           reject(new Error("Failed to load " + src))
//         );
//         return;
//       }
//       const s = document.createElement("script");
//       s.src = src;
//       s.async = true;
//       s.onload = () => {
//         s.setAttribute("data-loaded", "true");
//         resolve();
//       };
//       s.onerror = () => reject(new Error("Failed to load " + src));
//       document.head.appendChild(s);
//     });
//   }

//   // Update the ref whenever selectedClassId changes
//   useEffect(() => {
//     selectedClassIdRef.current = selectedClassId;
//   }, [selectedClassId]);

//   // Helper function to create drawing control
//   function createDrawingControl(map, drawnItems, color) {
//     const L = window.L;
//     return new L.Control.Draw({
//       draw: {
//         polyline: false,
//         polygon: {
//           allowIntersection: false,
//           showArea: true,
//           shapeOptions: {
//             color,
//             weight: 2,
//             fillOpacity: 0.4,
//             fillColor: color,
//           },
//         },
//         circle: false,
//         rectangle: false,
//         marker: false,
//         circlemarker: false,
//       },
//       edit: { featureGroup: drawnItems, edit: true, remove: true },
//     });
//   }

//   // Helper function to setup map events and controls
//   function setupMapControls(map, drawnItems) {
//     const L = window.L;

//     // Create initial control
//     const cls =
//       LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
//       LULC_CLASSES[0];
//     const control = createDrawingControl(map, drawnItems, cls.color);
//     controlRef.current = control;
//     map.addControl(control);

//     function refreshList() {
//       const list = [];
//       drawnItems.eachLayer((layer) => {
//         const feature = layer.toGeoJSON();
//         const id =
//           layer._customId ||
//           (feature && feature.id) ||
//           `${Math.random().toString(36).slice(2, 9)}`;
//         if (!layer._customId) layer._customId = id;
//         const props = (feature && feature.properties) || {};
//         list.push({ id, props, layer });
//       });
//       setPolygonsList(list);
//     }

//     // Setup drawing events
//     map.on(L.Draw.Event.CREATED, (e) => {
//       const layer = e.layer;
//       const id = `poly_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
//       layer._customId = id;
//       const geo = layer.toGeoJSON();
//       geo.properties = geo.properties || {};
//       geo.properties.lulc_class = selectedClassIdRef.current;
//       layer.feature = geo;

//       const selectedCls =
//         LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
//         LULC_CLASSES[0];

//       if (layer.setStyle) {
//         layer.setStyle({
//           color: selectedCls.color,
//           weight: 2,
//           fillOpacity: 0.4,
//           fillColor: selectedCls.color,
//         });
//       }

//       drawnItems.addLayer(layer);
//       refreshList();
//     });

//     map.on(L.Draw.Event.EDITED, (e) => {
//       e.layers.eachLayer((layer) => {
//         if (layer.feature) {
//           layer.feature.geometry = layer.toGeoJSON().geometry;
//         } else {
//           layer.feature = layer.toGeoJSON();
//         }
//       });
//       refreshList();
//     });

//     map.on(L.Draw.Event.DELETED, () => refreshList());

//     return { refreshList };
//   }

//   // Main initialization effect
//   useEffect(() => {
//     let canceled = false;

//     async function init() {
//       if (typeof window === "undefined" || typeof document === "undefined")
//         return;
//       if (isMapInitialized.current) return;

//       try {
//         setLoading(true);
//         addCss(CDN.leafletCss);
//         addCss(CDN.leafletDrawCss);

//         await addScript(CDN.leafletJs);
//         await addScript(CDN.leafletDrawJs);

//         const L = window.L;
//         if (!L || !L.Control || !L.Control.Draw)
//           throw new Error("Leaflet or Leaflet.draw not available");

//         const map = L.map(containerRef.current, { zoomControl: true }).setView(
//           [11.0, 78.0],
//           7
//         );

//         // Add base tile layer
//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           maxZoom: 19,
//           attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         }).addTo(map);

//         // Initialize drawing layers
//         const drawnItems = new L.FeatureGroup();
//         drawnRef.current = drawnItems;
//         map.addLayer(drawnItems);

//         // Setup drawing controls and events
//         const { refreshList } = setupMapControls(map, drawnItems);

//         mapRef.current = map;
//         isMapInitialized.current = true;

//         // Now fetch WMS layer data AFTER map is fully initialized
//         try {
//           const response = await fetch(
//             `http://192.168.29.152:8000/api/projects/${id}/rasters/`
//           );
//           const data = await response.json();

//           const layerData = Array.isArray(data) ? data[data.length - 1] : data;

//           const rgbBand = layerData.bands?.find(
//             (band) => band.band_type === "rgb"
//           );

//           const wmsUrl = rgbBand
//             ? rgbBand.wms_url.split("?")[0]
//             : layerData.wms_url?.split("?")[0];

//           console.log("Using WMS URL:", wmsUrl);

//           if (layerData && layerData.wms_url) {
//             // const wmsUrl = layerData.wms_url.split("?")[0];
//             const layerName = `${layerData.workspace}:${rgbBand.layer_name}`;

//             const wmsLayer = L.tileLayer.wms(wmsUrl, {
//               layers: layerName,
//               format: "image/png",
//               transparent: true,
//               version: "1.1.0",
//               attribution: "WMS Layer",
//             });

//             wmsLayer.addTo(map);
//             setWmsLoaded(true);

//             if (
//               layerData.bbox_minx !== undefined &&
//               layerData.bbox_miny !== undefined &&
//               layerData.bbox_maxx !== undefined &&
//               layerData.bbox_maxy !== undefined
//             ) {
//               map.fitBounds([
//                 [layerData.bbox_miny, layerData.bbox_minx],
//                 [layerData.bbox_maxy, layerData.bbox_maxx],
//               ]);
//             }
//           }
//         } catch (wmsError) {
//           console.error("Error fetching WMS data:", wmsError);
//           setWmsLoaded(true);
//         }
//         cleanupRef.current = () => {
//           try {
//             if (map) {
//               map.off();
//               if (controlRef.current) {
//                 map.removeControl(controlRef.current);
//               }
//               drawnItems.clearLayers();
//               map.remove();
//             }
//           } catch (err) {
//             console.error("Cleanup error:", err);
//           }
//         };

//         if (!canceled) {
//           setLoading(false);
//         }
//       } catch (err) {
//         if (!canceled) {
//           setError(String(err && err.message ? err.message : err));
//           setLoading(false);
//         }
//       }
//     }

//     init();

//     return () => {
//       canceled = true;
//       isMapInitialized.current = false;
//       try {
//         if (cleanupRef.current) {
//           cleanupRef.current();
//         }
//       } catch (err) {
//         console.error("Cleanup error:", err);
//       }
//     };
//   }, []);

//   // Handle class selection changes - only update control, don't recreate map
//   useEffect(() => {
//     if (!mapRef.current || !controlRef.current || !isMapInitialized.current)
//       return;

//     const L = window.L;
//     const cls =
//       LULC_CLASSES.find((c) => c.id === selectedClassId) || LULC_CLASSES[0];

//     try {
//       // Remove old control
//       mapRef.current.removeControl(controlRef.current);

//       // Create new control with updated color
//       const newControl = createDrawingControl(
//         mapRef.current,
//         drawnRef.current,
//         cls.color
//       );
//       controlRef.current = newControl;

//       // Add new control
//       mapRef.current.addControl(newControl);
//     } catch (err) {
//       console.error("Error updating drawing control:", err);
//     }
//   }, [selectedClassId]);

//   // Handle editing state changes
//   useEffect(() => {
//     if (!drawnRef.current) return;

//     drawnRef.current.eachLayer((layer) => {
//       try {
//         if (layer._customId === editingId) {
//           if (layer.editing && layer.editing.enable) layer.editing.enable();
//         } else {
//           if (layer.editing && layer.editing.disable) layer.editing.disable();
//         }
//       } catch (err) {
//         console.error("Error toggling layer editing:", err);
//       }
//     });

//     if (!editingId) {
//       const list = [];
//       drawnRef.current.eachLayer((layer) => {
//         const feature = layer.toGeoJSON();
//         const id =
//           layer._customId ||
//           (feature && feature.id) ||
//           `${Math.random().toString(36).slice(2, 9)}`;
//         const props = (feature && feature.properties) || {};
//         list.push({ id, props, layer });
//       });
//       setPolygonsList(list);
//     }
//   }, [editingId]);

//   // Class properties mapping
//   const CLASS_PROPERTIES = {
//     agriculture: {
//       Classname: "Agricultural Lands",
//       Classvalue: 5,
//       RED: 170,
//       GREEN: 255,
//       BLUE: 0,
//     },
//     water: {
//       Classname: "Water Bodies",
//       Classvalue: 1,
//       RED: 0,
//       GREEN: 112,
//       BLUE: 255,
//     },
//     forest: {
//       Classname: "Forest",
//       Classvalue: 4,
//       RED: 76,
//       GREEN: 115,
//       BLUE: 0,
//     },
//     builtup: {
//       Classname: "Buildings",
//       Classvalue: 2,
//       RED: 255,
//       GREEN: 0,
//       BLUE: 0,
//     },
//     barren: {
//       Classname: "Barren Lands",
//       Classvalue: 3,
//       RED: 14,
//       GREEN: 195,
//       BLUE: 177,
//     },
//   };

//   async function exportGeoJSON() {
//     if (!drawnRef.current) return;

//     setExportStatus({ loading: true, success: false, error: null });

//     try {
//       const features = [];
//       drawnRef.current.eachLayer((layer) => {
//         const feat = layer.feature
//           ? JSON.parse(JSON.stringify(layer.feature))
//           : layer.toGeoJSON();
//         const lulcClass = feat.properties.lulc_class || "unclassified";

//         const classProps = CLASS_PROPERTIES[lulcClass] || {
//           Classname: "Unknown",
//           Classvalue: 0,
//           RED: 200,
//           GREEN: 200,
//           BLUE: 200,
//         };

//         // Convert Polygon to MultiPolygon if necessary
//         const geometry = feat.geometry;
//         if (geometry.type === "Polygon") {
//           geometry.type = "MultiPolygon";
//           geometry.coordinates = [geometry.coordinates];
//         }

//         features.push({
//           type: "Feature",
//           properties: {
//             ...classProps,
//             Count: 0, 
//           },
//           geometry,
//         });
//       });

//       const featureCollection = { type: "FeatureCollection", features };

//       // Convert to Blob
//       const blob = new Blob([JSON.stringify(featureCollection)], {
//         type: "application/json",
//       });

//       const formData = new FormData();
//       formData.append("training_file", blob, `lulc_project_${id}.geojson`);
//       formData.append("project_id", id);
//       formData.append("created_at", new Date().toISOString());

//       const response = await fetch(
//         `http://192.168.29.152:8000/api/projects/${id}/lulc/`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Backend error:", errorText);
//         throw new Error(`HTTP ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log("Export successful:", result);

//       setExportStatus({ loading: false, success: true, error: null });

//       // Optional: Download locally
//       const downloadUrl = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = `lulc_polygons_project_${id}.geojson`;
//       a.click();
//       URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error("Export failed:", error);
//       setExportStatus({
//         loading: false,
//         success: false,
//         error: error.message || "Failed to export data",
//       });
//     }
//   }

//   function clearAll() {
//     if (drawnRef.current) {
//       drawnRef.current.clearLayers();
//     }
//     setPolygonsList([]);
//   }

//   function removePolygon(item) {
//     if (!drawnRef.current) return;
//     let removed = false;
//     drawnRef.current.eachLayer((layer) => {
//       if (layer._customId === item.id) {
//         drawnRef.current.removeLayer(layer);
//         removed = true;
//       }
//     });
//     if (removed) {
//       setPolygonsList((prev) => prev.filter((p) => p.id !== item.id));
//     }
//   }

//   return (
//     <div
//       className="font-sans w-full flex bg-gradient-to-br from-slate-50 to-slate-100"
//       style={{ height: "calc(100vh - 60px)" }}
//     >
//       {/* Sidebar */}
//       <aside
//         className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
//         style={{ maxHeight: "calc(100vh - 60px)" }}
//       >
//         {/* Header */}
//         <div className="space-y-1">
//           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
//             LULC Training
//           </h1>
//           <p className="text-slate-600 text-xs font-medium">
//             Create training polygons for land use classification
//           </p>
//         </div>

//         {/* Status indicator */}
//         <div
//           className={`p-3 rounded-lg border ${
//             loading
//               ? "bg-yellow-50 border-yellow-200 text-yellow-800"
//               : wmsLoaded
//               ? "bg-green-50 border-green-200 text-green-800"
//               : "bg-red-50 border-red-200 text-red-800"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-2 h-2 rounded-full ${
//                 loading
//                   ? "bg-yellow-500 animate-pulse"
//                   : wmsLoaded
//                   ? "bg-green-500"
//                   : "bg-red-500"
//               }`}
//             />
//             <span className="text-sm font-medium">
//               {loading
//                 ? "Loading map and WMS layer..."
//                 : wmsLoaded
//                 ? "Map ready - Drawing tools active"
//                 : "Map ready - WMS layer failed"}
//             </span>
//           </div>
//         </div>

//         {/* Class Selection */}
//         <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-100 flex-shrink-0">
//           <label className="block text-sm font-semibold text-slate-800 mb-3">
//             Land Cover Class
//           </label>
//           <div className="space-y-2">
//             {LULC_CLASSES.map((cls) => (
//               <button
//                 key={cls.id}
//                 onClick={() => setSelectedClassId(cls.id)}
//                 className={`w-full flex items-center gap-2 p-1 pr-2 rounded-lg transition-all duration-200 border ${
//                   selectedClassId === cls.id
//                     ? "bg-white border-blue-400 shadow-md ring-1 ring-blue-400/30"
//                     : "bg-white/60 border-transparent hover:bg-white/80 hover:shadow-sm"
//                 }`}
//               >
//                 <div
//                   className={`w-4 h-2 rounded-md shadow-sm transition-all duration-200 ${
//                     selectedClassId === cls.id
//                       ? "ring-2 ring-blue-400/40"
//                       : "ring-1 ring-white/80"
//                   }`}
//                   style={{ background: cls.color }}
//                 />
//                 <span
//                   className={`font-medium text-sm text-left flex-1 transition-colors ${
//                     selectedClassId === cls.id
//                       ? "text-blue-900"
//                       : "text-slate-700"
//                   }`}
//                 >
//                   {cls.label}
//                 </span>
//                 {selectedClassId === cls.id && (
//                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 flex-shrink-0">
//             <button
//             onClick={exportGeoJSON}
//             disabled={
//               loading || polygonsList.length === 0 || exportStatus.loading
//             }
//             className={`flex-1 font-medium py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm ${
//               exportStatus.success
//                 ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                 : exportStatus.error
//                 ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
//                 : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
//             } disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white`}
//           >
//             {exportStatus.loading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 <span>Exporting...</span>
//               </div>
//               ) : exportStatus.success ? ( `✓ Exported (${polygonsList.length})`
//             ) : exportStatus.error ? (
//               `✗ Export Failed (${polygonsList.length})`
//             ) : (
//               `Export to API (${polygonsList.length})`
//             )}
//           </button>
//           <button
//             onClick={clearAll}
//             disabled={loading || polygonsList.length === 0}
//             className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* Guide */}
//         <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
//             <span className="font-semibold text-amber-800 text-base">
//               Quick Guide
//             </span>
//           </div>
//           <ul className="text-xs text-amber-700 space-y-2 leading-relaxed">
//             <li>• Wait for map to load completely</li>
//             <li>• Select a land cover class above</li>
//             <li>• Use the polygon tool in the map toolbar</li>
//             <li>• Draw training areas on the map</li>
//             <li>• Export when ready for ML training</li>
//           </ul>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-2 h-2 bg-red-500 rounded-full" />
//               <span className="font-medium text-red-800 text-sm">Error</span>
//             </div>
//             <div
//               className="text-red-700 text-sm"
//               style={{ whiteSpace: "pre-wrap" }}
//             >
//               {error}
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Map Container */}
//       <main className="flex-1 relative overflow-hidden">
//         {loading && (
//           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
//             <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
//               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <span className="text-slate-700 font-medium">
//                 {isMapInitialized.current
//                   ? "Loading WMS layer..."
//                   : "Initializing map..."}
//               </span>
//             </div>
//           </div>
//         )}
//         <div
//           ref={containerRef}
//           className="w-full h-full overflow-hidden shadow-2xl"
//           style={{ minHeight: 400, zIndex: 0 }}
//         />
//       </main>
//     </div>
//   );
// }