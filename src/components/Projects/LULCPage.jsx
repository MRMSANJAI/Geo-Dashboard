import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";

const LULC_CLASSES = [
  { id: "agriculture", label: "Agriculture", color: "#84cc16" },
  { id: "water", label: "Water", color: "#0ea5e9" },
  { id: "forest", label: "Forest", color: "#15803d" },
  { id: "builtup", label: "Built-up", color: "#f97316" },
  { id: "barren", label: "Barren", color: "#a8a29e" },
];

const CDN = {
  leafletCss: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  leafletJs: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  leafletDrawCss: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css",
  leafletDrawJs: "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js",
};

export default function LULCMap() {
  const { BaseLayer, Overlay } = LayersControl;

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const drawnRef = useRef(null);
  const controlRef = useRef(null);
  const cleanupRef = useRef(null);
  const selectedClassIdRef = useRef(LULC_CLASSES[0].id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(LULC_CLASSES[0].id);
  const [polygonsList, setPolygonsList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  function addCss(href) {
    if (typeof document === "undefined") return;
    const exists = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    ).some((l) => l.href === href);
    if (!exists) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }

  function addScript(src) {
    return new Promise((resolve, reject) => {
      if (typeof document === "undefined")
        return reject(new Error("document not found"));
      const existing = Array.from(document.getElementsByTagName("script")).find(
        (s) => s.src === src
      );
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") return resolve();
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load " + src))
        );
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        s.setAttribute("data-loaded", "true");
        resolve();
      };
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  // Update the ref whenever selectedClassId changes
  useEffect(() => {
    selectedClassIdRef.current = selectedClassId;
  }, [selectedClassId]);
  function waitForGlobal(checkFn, timeout = 10000, interval = 100) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      function poll() {
        try {
          const val = checkFn();
          if (val) return resolve(val);
        } catch (err) {}
        if (Date.now() - start > timeout)
          return reject(new Error("Timed out waiting for global"));
        setTimeout(poll, interval);
      }
      poll();
    });
  }

  useEffect(() => {
    let canceled = false;
    const currentSelectedClassId = selectedClassId; // Capture the current value

    async function init() {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;
      try {
        addCss(CDN.leafletCss);
        addCss(CDN.leafletDrawCss);

        await addScript(CDN.leafletJs);
        await addScript(CDN.leafletDrawJs);

        const L = window.L;
        if (!L || !L.Control || !L.Control.Draw)
          throw new Error("Leaflet or Leaflet.draw not available");

        const map = L.map(containerRef.current, { zoomControl: true }).setView(
          [11.0, 78.0],
          7
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);


        //fetch WMS layer data
        fetch("http://192.168.29.152:8000/api/projects/15/rasters/")
          .then((res) => res.json())
          .then((data) => {
            const layerData = Array.isArray(data)
              ? data[data.length - 1]
              : data;
            const wmsUrl = layerData.wms_url.split("?")[0];
            const layerName = `${layerData.workspace}:${layerData.layer_name}`;

            L.tileLayer
              .wms(wmsUrl, {
                layers: layerName,
                format: "image/png",
                transparent: true,
                version: "1.1.0",
              })
              .addTo(map);

            if (layerData.bbox_minx !== undefined) {
              map.fitBounds([
                [layerData.bbox_miny, layerData.bbox_minx],
                [layerData.bbox_maxy, layerData.bbox_maxx],
              ]);
            }
          })
          .catch((err) => console.error("Error fetching WMS data:", err));

        // Example: Adding a WMS Layer
        const wmsUrl = "http://192.168.29.152:8080/geoserver/wms"; // your GeoServer WMS endpoint
        const layerName = "workspace:layer_name"; // change to your layer name

        L.tileLayer
          .wms(wmsUrl, {
            layers: layerName,
            format: "image/png",
            transparent: true,
            version: "1.1.0",
          })
          .addTo(map);

        // Optional: Fit map to WMS bounding box
        const bbox = [minLat, minLng, maxLat, maxLng]; // replace with your bbox values
        map.fitBounds([
          [bbox[1], bbox[0]],
          [bbox[3], bbox[2]],
        ]);



        const drawnItems = new L.FeatureGroup();
        drawnRef.current = drawnItems;
        map.addLayer(drawnItems);

        function createControl(color) {
          return new L.Control.Draw({
            draw: {
              polyline: false,
              polygon: {
                allowIntersection: false,
                showArea: true,
                shapeOptions: {
                  color,
                  weight: 2,
                  fillOpacity: 0.4,
                  fillColor: color,
                },
              },
              circle: false,
              rectangle: false,
              marker: false,
              circlemarker: false,
            },
            edit: { featureGroup: drawnItems, edit: true, remove: true },
          });
        }

        controlRef.current = createControl(
          LULC_CLASSES.find((c) => c.id === currentSelectedClassId).color
        );
        map.addControl(controlRef.current);

        function refreshList() {
          const list = [];
          drawnItems.eachLayer((layer) => {
            const feature = layer.toGeoJSON();
            const id =
              layer._customId ||
              (feature && feature.id) ||
              `${Math.random().toString(36).slice(2, 9)}`;
            if (!layer._customId) layer._customId = id;
            const props = (feature && feature.properties) || {};
            list.push({ id, props, layer });
          });
          setPolygonsList(list);
        }

        map.on(L.Draw.Event.CREATED, (e) => {
          const layer = e.layer;
          const id = `poly_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
          layer._customId = id;
          const geo = layer.toGeoJSON();
          geo.properties = geo.properties || {};
          // Use the ref to get the current selectedClassId
          geo.properties.lulc_class = selectedClassIdRef.current;
          layer.feature = geo;
          const cls =
            LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
            LULC_CLASSES[0];
          if (layer.setStyle)
            layer.setStyle({
              color: cls.color,
              weight: 2,
              fillOpacity: 0.4,
              fillColor: cls.color,
            });
          drawnItems.addLayer(layer);
          refreshList();
        });

        map.on(L.Draw.Event.EDITED, (e) => {
          e.layer.eachLayer((layer) => {
            if (layer.feature)
              layer.feature.geometry = layer.toGeoJSON().geometry;
            else layer.feature = layer.toGeoJSON();
          });
          refreshList();
        });

        map.on(L.Draw.Event.DELETED, () => refreshList());

        mapRef.current = map;

        cleanupRef.current = () => {
          try {
            map.off();
            if (controlRef.current) map.removeControl(controlRef.current);
            drawnItems.clearLayers();
            map.remove();
          } catch (err) {}
        };

        if (!canceled) setLoading(false);
      } catch (err) {
        if (!canceled) {
          setError(String(err && err.message ? err.message : err));
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      canceled = true;
      try {
        if (cleanupRef.current) cleanupRef.current();
      } catch (err) {}
    };
  }, []); // Remove selectedClassId dependency

  useEffect(() => {
    if (!mapRef.current) return;
    try {
      if (controlRef.current) mapRef.current.removeControl(controlRef.current);
    } catch (err) {}
    const L = window.L;
    const cls =
      LULC_CLASSES.find((c) => c.id === selectedClassId) || LULC_CLASSES[0];
    controlRef.current = new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: cls.color,
            weight: 2,
            fillOpacity: 0.4,
            fillColor: cls.color,
          },
        },
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnRef.current, edit: true, remove: true },
    });
    try {
      mapRef.current.addControl(controlRef.current);
    } catch (err) {}
  }, [selectedClassId]);

  useEffect(() => {
    if (!drawnRef.current) return;
    drawnRef.current.eachLayer((layer) => {
      try {
        if (layer._customId === editingId) {
          if (layer.editing && layer.editing.enable) layer.editing.enable();
        } else {
          if (layer.editing && layer.editing.disable) layer.editing.disable();
        }
      } catch (err) {}
    });
    if (!editingId) {
      const list = [];
      drawnRef.current.eachLayer((layer) => {
        const feature = layer.toGeoJSON();
        const id =
          layer._customId ||
          (feature && feature.id) ||
          `${Math.random().toString(36).slice(2, 9)}`;
        const props = (feature && feature.properties) || {};
        list.push({ id, props, layer });
      });
      setPolygonsList(list);
    }
  }, [editingId]);

  function exportGeoJSON() {
    if (!drawnRef.current) return;
    const features = [];
    drawnRef.current.eachLayer((layer) => {
      const feat = layer.feature
        ? JSON.parse(JSON.stringify(layer.feature))
        : layer.toGeoJSON();
      feat.properties = feat.properties || {};
      if (!feat.properties.lulc_class)
        feat.properties.lulc_class = "unclassified";
      features.push(feat);
    });
    const fc = { type: "FeatureCollection", features };
    const blob = new Blob([JSON.stringify(fc, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lulc_polygons.geojson";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (drawnRef.current) drawnRef.current.clearLayers();
    setPolygonsList([]);
  }

  function removePolygon(item) {
    if (!drawnRef.current) return;
    let removed = false;
    drawnRef.current.eachLayer((layer) => {
      if (layer._customId === item.id) {
        drawnRef.current.removeLayer(layer);
        removed = true;
      }
    });
    if (removed)
      setPolygonsList((prev) => prev.filter((p) => p.id !== item.id));
  }

  return (
    <div
      className="font-sans w-full flex bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <aside
        className="w-96 bg-white/95 backdrop-blur-sm shadow-xl border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 60px)" }}
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            LULC Training
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Create training polygons for land use classification
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
          <label className="block text-lg font-semibold text-slate-800 mb-5">
            Land Cover Class
          </label>
          <div className="space-y-3">
            {LULC_CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border-2 ${
                  selectedClassId === cls.id
                    ? "bg-white border-blue-500 shadow-lg ring-2 ring-blue-500/20 transform scale-[1.02]"
                    : "bg-white/60 border-transparent hover:bg-white/80 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shadow-sm transition-all duration-200 ${
                    selectedClassId === cls.id
                      ? "ring-3 ring-blue-500/30 scale-110"
                      : "ring-2 ring-white/80"
                  }`}
                  style={{ background: cls.color }}
                />
                <span
                  className={`font-semibold text-left flex-1 transition-colors ${
                    selectedClassId === cls.id
                      ? "text-blue-900"
                      : "text-slate-700"
                  }`}
                >
                  {cls.label}
                </span>
                {selectedClassId === cls.id && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      Selected
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportGeoJSON}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Export GeoJSON
          </button>
          <button
            onClick={clearAll}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Clear All
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="font-semibold text-amber-800 text-base">
              Quick Guide
            </span>
          </div>
          <ul className="text-sm text-amber-700 space-y-2 leading-relaxed">
            <li>• Select a land cover class above</li>
            <li>• Use the polygon tool in the map toolbar</li>
            <li>• Draw training areas on the map</li>
            <li>• Export when ready for ML training</li>
          </ul>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="font-semibold text-red-800 text-base">
                Error
              </span>
            </div>
            <div
              className="text-red-700 text-sm"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {error}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-700 font-medium">Loading map...</span>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full rounded-tl-3xl overflow-hidden shadow-2xl"
          style={{ height: "calc(100vh - 60px)" }}
        />

        {/* <MapContainer
         
          center={[11.0, 78.0]}
          zoom={7}
          style={{ height: "100vh", width: "100%" }}
        >
          <LayersControl position="topright">
                  <BaseLayer checked name="OpenStreetMap">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </BaseLayer>
                  <BaseLayer name="Satellite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  </BaseLayer>
                  <BaseLayer name="Carto Light">
                    <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
                  </BaseLayer>
                  <Overlay name="Labels">
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                  </Overlay>
                </LayersControl>
        </MapContainer>  */}
      </main>
    </div>
  );
}

// LULCPage.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   LayersControl,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import "leaflet-draw"; // attaches Leaflet.Draw to L

// const { BaseLayer, Overlay } = LayersControl;

// const LULC_CLASSES = [
//   { id: "agriculture", label: "Agriculture", color: "#84cc16" },
//   { id: "water", label: "Water", color: "#0ea5e9" },
//   { id: "forest", label: "Forest", color: "#15803d" },
//   { id: "builtup", label: "Built-up", color: "#f97316" },
//   { id: "barren", label: "Barren", color: "#a8a29e" },
// ];

// // --- WMS layer as a React-Leaflet helper ---
// function WMSLayer({ wmsUrl, layerName, bbox }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!wmsUrl || !layerName) return;
//     const wms = L.tileLayer.wms(wmsUrl, {
//       layers: layerName,
//       format: "image/png",
//       transparent: true,
//       version: "1.1.0",
//     });
//     wms.addTo(map);

//     if (bbox) {
//       const bounds = [
//         [bbox.bbox_miny, bbox.bbox_minx],
//         [bbox.bbox_maxy, bbox.bbox_maxx],
//       ];
//       map.fitBounds(bounds);
//     }

//     return () => {
//       map.removeLayer(wms);
//     };
//   }, [wmsUrl, layerName, bbox, map]);

//   return null;
// }

// // --- Draw controls, fully inside React-Leaflet (no vanilla Map init) ---
// function DrawControls({
//   selectedClassId,
//   classes,
//   onListChange,
//   featureGroupRef,
// }) {
//   const map = useMap();
//   const fgRef = useRef(null);
//   const drawControlRef = useRef(null);
//   const selectedClass = useMemo(
//     () => classes.find((c) => c.id === selectedClassId) || classes[0],
//     [classes, selectedClassId]
//   );

//   // 1️⃣ Create and attach FeatureGroup
//   useEffect(() => {
//     if (fgRef.current) return; // only once
//     const fg = L.featureGroup();
//     fgRef.current = fg;
//     featureGroupRef.current = fg; // expose to parent
//     map.addLayer(fg);

//     const refreshList = () => {
//       const list = [];
//       fg.eachLayer((layer) => {
//         const feature = layer.toGeoJSON();
//         const id =
//           layer._customId ||
//           feature?.id ||
//           Math.random().toString(36).slice(2, 9);
//         if (!layer._customId) layer._customId = id;
//         list.push({ id, props: feature.properties || {}, layer });
//       });
//       onListChange(list);
//     };

//     map.on(L.Draw.Event.CREATED, (e) => {
//       const layer = e.layer;
//       const id = `poly_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
//       layer._customId = id;

//       const geo = layer.toGeoJSON();
//       geo.properties = geo.properties || {};
//       geo.properties.lulc_class = selectedClass.id;
//       layer.feature = geo;

//       if (layer.setStyle) {
//         layer.setStyle({
//           color: selectedClass.color,
//           weight: 2,
//           fillOpacity: 0.4,
//           fillColor: selectedClass.color,
//         });
//       }

//       fg.addLayer(layer);
//       refreshList();
//     });

//     map.on(L.Draw.Event.EDITED, refreshList);
//     map.on(L.Draw.Event.DELETED, refreshList);

//     return () => {
//       map.off(L.Draw.Event.CREATED);
//       map.off(L.Draw.Event.EDITED);
//       map.off(L.Draw.Event.DELETED);
//       map.removeLayer(fg);
//     };
//   }, [map, onListChange, featureGroupRef, selectedClass]);

//   // 2️⃣ Create draw toolbar whenever selected class changes
//   useEffect(() => {
//     if (!fgRef.current) return;

//     // remove old toolbar
//     if (drawControlRef.current) {
//       map.removeControl(drawControlRef.current);
//       drawControlRef.current = null;
//     }

//     const ctrl = new L.Control.Draw({
//       draw: {
//         polyline: false,
//         polygon: {
//           allowIntersection: false,
//           showArea: true,
//           shapeOptions: {
//             color: selectedClass.color,
//             weight: 2,
//             fillOpacity: 0.4,
//             fillColor: selectedClass.color,
//           },
//         },
//         rectangle: false,
//         circle: false,
//         marker: false,
//         circlemarker: false,
//       },
//       edit: {
//         featureGroup: fgRef.current, // ✅ use existing FeatureGroup
//         selectedPathOptions: {
//           color: '#ff0000',
//           weight: 3,
//         },
//       },
//     });

//     drawControlRef.current = ctrl;
//     map.addControl(ctrl);

//     return () => {
//       try {
//         map.removeControl(ctrl);
//       } catch (_) {}
//     };
//   }, [map, selectedClass]);

//   return null;
// }

// export default function LULCPage() {
//   const [selectedClassId, setSelectedClassId] = useState(LULC_CLASSES[0].id);
//   const [polygonsList, setPolygonsList] = useState([]);
//   const featureGroupRef = useRef(null);

//   // WMS data
//   const [layerData, setLayerData] = useState(null);
//   useEffect(() => {
//     // TODO: replace with your dynamic project id, this is just an example.
//     fetch("http://192.168.29.152:8000/api/projects/15/rasters/")
//       .then((r) => r.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           setLayerData(data[data.length - 1]);
//         } else if (data && typeof data === "object") {
//           setLayerData(data);
//         }
//       })
//       .catch((err) => console.error("Error fetching WMS data:", err));
//   }, []);

//   // Export all polygons in the FG as GeoJSON
//   const exportGeoJSON = () => {
//     const fg = featureGroupRef.current;
//     if (!fg) return;
//     const features = [];
//     fg.eachLayer((layer) => {
//       const feat = layer.feature
//         ? JSON.parse(JSON.stringify(layer.feature))
//         : layer.toGeoJSON();
//       feat.properties = feat.properties || {};
//       if (!feat.properties.lulc_class) feat.properties.lulc_class = "unclassified";
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
//   };

//   // Clear everything
//   const clearAll = () => {
//     const fg = featureGroupRef.current;
//     if (!fg) return;
//     fg.clearLayers();
//     setPolygonsList([]);
//   };

//   return (
//     <div className="w-full h-screen flex">
//       {/* Left panel */}
//       <aside className="w-80 p-4 border-r bg-white overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-2">LULC Training</h2>
//         <p className="text-sm text-slate-600 mb-4">
//           Choose a class, draw polygons, edit/delete, then export as GeoJSON.
//         </p>

//         <div className="space-y-2 mb-4">
//           {LULC_CLASSES.map((cls) => (
//             <button
//               key={cls.id}
//               onClick={() => setSelectedClassId(cls.id)}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded border ${
//                 selectedClassId === cls.id
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-slate-200 hover:bg-slate-50"
//               }`}
//             >
//               <span
//                 style={{ background: cls.color }}
//                 className="inline-block w-5 h-5 rounded"
//               />
//               <span className="text-sm font-medium">{cls.label}</span>
//               {selectedClassId === cls.id && (
//                 <span className="ml-auto text-xs text-blue-600">selected</span>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={exportGeoJSON}
//             className="flex-1 px-3 py-2 rounded bg-blue-600 text-white text-sm"
//           >
//             Export GeoJSON
//           </button>
//           <button
//             onClick={clearAll}
//             className="px-3 py-2 rounded bg-red-600 text-white text-sm"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* (Optional) tiny list preview */}
//         <div className="mt-4">
//           <h3 className="text-sm font-semibold mb-2">Polygons: {polygonsList.length}</h3>
//           <ul className="text-xs space-y-1 max-h-48 overflow-auto">
//             {polygonsList.map((p) => (
//               <li key={p.id} className="truncate">
//                 {p.id} — {p.props?.lulc_class || "unclassified"}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </aside>

//       {/* Map */}
//       <main className="flex-1">
//         <MapContainer
//           style={{ height: "100%", width: "100%" }}
//           center={[13.5, 80.1]}
//           zoom={8}
//         >
//           {/* Base layer (also repeated inside the LayersControl for switching) */}
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {/* WMS Raster */}
//           {layerData && (
//             <WMSLayer
//               wmsUrl={(layerData.wms_url || "").split("?")[0]}
//               layerName={`${layerData.workspace}:${layerData.layer_name}`}
//               bbox={layerData}
//             />
//           )}

//           {/* Draw toolbar + edit/remove, wired to selected class */}
//           <DrawControls
//             selectedClassId={selectedClassId}
//             classes={LULC_CLASSES}
//             onListChange={setPolygonsList}
//             featureGroupRef={featureGroupRef}
//           />

//           {/* Base/overlay switcher */}
//           <LayersControl position="topright">
//             <BaseLayer checked name="OpenStreetMap">
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             </BaseLayer>
//             <BaseLayer name="Satellite">
//               <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
//             </BaseLayer>
//             <BaseLayer name="Carto Light">
//               <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
//             </BaseLayer>
//             <Overlay name="Labels">
//               <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
//             </Overlay>
//           </LayersControl>
//         </MapContainer>
//       </main>
//     </div>
//   );
// }
