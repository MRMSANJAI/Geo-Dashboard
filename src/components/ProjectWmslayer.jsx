// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const WMSLayer = ({ wmsUrl, layerName, bbox }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!wmsUrl || !layerName) return;

//     // Add WMS layer
//     const wmsLayer = L.tileLayer.wms(wmsUrl, {
//       layers: layerName,
//       format: "image/png",
//       transparent: true,
//       version: "1.1.0",
//     });

//     wmsLayer.addTo(map);

//     // Fit to bounding box
//     if (bbox) {
//       const bounds = [
//         [bbox.bbox_miny, bbox.bbox_minx],
//         [bbox.bbox_maxy, bbox.bbox_maxx],
//       ];
//       map.fitBounds(bounds);
//     }

//     return () => {
//       map.removeLayer(wmsLayer);
//     };
//   }, [wmsUrl, layerName, bbox, map]);

//   return null;
// };

// export default function MyMap() {
//   const [layerData, setLayerData] = useState(null);

//   useEffect(() => {
//     fetch("http://192.168.29.152:8000/api/projects/7/rasters/")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           setLayerData(data[data.length - 1]); // Get last one in the array
//         } else if (!Array.isArray(data)) {
//           setLayerData(data); // If API sends a single object
//         }
//       })
//       .catch((err) => console.error("Error fetching WMS data:", err));
//   }, []);

//   return (
//     <MapContainer
//       style={{ height: "100vh", width: "100%" }}
//       center={[13.5, 80.1]}
//       zoom={8}
//     >
//       {/* Base OSM Layer */}
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* WMS Raster Layer */}
//       {layerData && (
//         <>
//           {console.log(
//       "Final WMS URL:",
//       layerData.wms_url.split("?")[0],
//       `${layerData.workspace}:${layerData.layer_name}`
//     )}

//           <WMSLayer
//             wmsUrl={layerData.wms_url.split("?")[0]} // Get only the base WMS endpoint
//             layerName={`${layerData.workspace}:${layerData.layer_name}`}
//             bbox={layerData}
//           />
//         </>
//       )}
//     </MapContainer>
//   );
// }
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WMSLayer = ({ wmsUrl, layerName }) => {
  const map = useMap();

  useEffect(() => {
    if (!wmsUrl || !layerName) return;

    console.log("Adding WMS layer:", wmsUrl, layerName);

    const wmsLayer = L.tileLayer.wms(wmsUrl, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      version: "1.1.0",
    });

    wmsLayer.addTo(map);

    return () => {
      map.removeLayer(wmsLayer);
    };
  }, [wmsUrl, layerName, map]);

  return null;
};

export default function MyMap() {
  const [lastLayer, setLastLayer] = useState(null);

  useEffect(() => {
    fetch("http://192.168.29.152:8000/api/projects/6/rasters/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const last = data[data.length - 1]; // last object
          console.log("Last WMS Layer Data:", last);

          setLastLayer({
            wmsUrl: "http://192.168.29.152:8080/geoserver/wms", // fixed IP
            layerName: `${last.workspace}:${last.store_name}`,
          });
        }
      })
      .catch((err) => console.error("Error fetching WMS data:", err));
  }, []);

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      center={[13.5, 80.1]}
      zoom={8}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {lastLayer && (
        <WMSLayer wmsUrl={lastLayer.wmsUrl} layerName={lastLayer.layerName} />
      )}
    </MapContainer>
  );
}

