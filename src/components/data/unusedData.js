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
