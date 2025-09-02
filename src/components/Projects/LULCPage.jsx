import React, { useEffect, useRef, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

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

export default function LULCPage() {
  const { id } = useParams();

  const { refreshProject, updateProjectTags, project } = useOutletContext();

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const drawnRef = useRef(null);
  const controlRef = useRef(null);
  const cleanupRef = useRef(null);
  const selectedClassIdRef = useRef(LULC_CLASSES[0].id);
  const isMapInitialized = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(LULC_CLASSES[0].id);
  const [polygonsList, setPolygonsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [wmsLoaded, setWmsLoaded] = useState(false);
  const [exportStatus, setExportStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

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

  // Helper function to create drawing control
  function createDrawingControl(map, drawnItems, color) {
    const L = window.L;
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

  // Helper function to setup map events and controls
  function setupMapControls(map, drawnItems) {
    const L = window.L;

    // Create initial control
    const cls =
      LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
      LULC_CLASSES[0];
    const control = createDrawingControl(map, drawnItems, cls.color);
    controlRef.current = control;
    map.addControl(control);

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

    // Setup drawing events
    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      const id = `poly_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      layer._customId = id;
      const geo = layer.toGeoJSON();
      geo.properties = geo.properties || {};
      geo.properties.lulc_class = selectedClassIdRef.current;
      layer.feature = geo;

      const selectedCls =
        LULC_CLASSES.find((c) => c.id === selectedClassIdRef.current) ||
        LULC_CLASSES[0];

      if (layer.setStyle) {
        layer.setStyle({
          color: selectedCls.color,
          weight: 2,
          fillOpacity: 0.4,
          fillColor: selectedCls.color,
        });
      }

      drawnItems.addLayer(layer);
      refreshList();
    });

    map.on(L.Draw.Event.EDITED, (e) => {
      e.layers.eachLayer((layer) => {
        if (layer.feature) {
          layer.feature.geometry = layer.toGeoJSON().geometry;
        } else {
          layer.feature = layer.toGeoJSON();
        }
      });
      refreshList();
    });

    map.on(L.Draw.Event.DELETED, () => refreshList());

    return { refreshList };
  }

  // Main initialization effect
  useEffect(() => {
    let canceled = false;
    async function init() {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;
      if (isMapInitialized.current) return;

      try {
        setLoading(true);
        addCss(CDN.leafletCss);
        addCss(CDN.leafletDrawCss);

        await addScript(CDN.leafletJs);
        await addScript(CDN.leafletDrawJs);

        const L = window.L;
        if (!L || !L.Control || !L.Control.Draw)
          throw new Error("Leaflet or Leaflet.draw not available");

        // ✅ Initialize map
        const map = L.map(containerRef.current, { zoomControl: true }).setView(
          [11.0, 78.0],
          7
        );

        // ✅ Base Layers
        const osm = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map); // Add OSM by default

        const esriSat = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "Tiles © Esri",
          }
        );
        const topo = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 17,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a>',
          }
        );

        // ✅ Drawn Items (Training Polygons)
        const drawnItems = new L.FeatureGroup();
        drawnRef.current = drawnItems;
        map.addLayer(drawnItems);

        // ✅ Setup drawing controls
        const { refreshList } = setupMapControls(map, drawnItems);

        // ✅ Prepare for WMS Layer
        let wmsLayer = null;

        try {
          const response = await fetch(
            `http://192.168.29.152:8000/api/projects/${id}/rasters/`
          );
          const data = await response.json();

          const layerData = Array.isArray(data) ? data[data.length - 1] : data;
          const rgbBand = layerData.bands?.find(
            (band) => band.band_type === "rgb"
          );

          const wmsUrl = rgbBand
            ? rgbBand.wms_url.split("?")[0]
            : layerData.wms_url?.split("?")[0];

          if (layerData && layerData.wms_url) {
            const layerName = `${layerData.workspace}:${rgbBand.layer_name}`;
            wmsLayer = L.tileLayer.wms(wmsUrl, {
              layers: layerName,
              format: "image/png",
              transparent: true,
              version: "1.1.0",
              attribution: "WMS Layer",
            });

            wmsLayer.addTo(map);
            setWmsLoaded(true);

            if (
              layerData.bbox_minx !== undefined &&
              layerData.bbox_miny !== undefined &&
              layerData.bbox_maxx !== undefined &&
              layerData.bbox_maxy !== undefined
            ) {
              map.fitBounds([
                [layerData.bbox_miny, layerData.bbox_minx],
                [layerData.bbox_maxy, layerData.bbox_maxx],
              ]);
            }
          }
        } catch (wmsError) {
          console.error("Error fetching WMS data:", wmsError);
          setWmsLoaded(true);
        }

        // ✅ Add Layer Control
        const baseMaps = {
          "OpenStreetMap": osm,
          "Esri Satellite": esriSat,
          "Topo Map": topo,
        };

        const overlayMaps = {
          " Layer": wmsLayer,
          "Training Polygons": drawnItems,
        };

        L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);

        // ✅ Save map reference
        mapRef.current = map;
        isMapInitialized.current = true;

        cleanupRef.current = () => {
          try {
            if (map) {
              map.off();
              if (controlRef.current) {
                map.removeControl(controlRef.current);
              }
              drawnItems.clearLayers();
              map.remove();
            }
          } catch (err) {
            console.error("Cleanup error:", err);
          }
        };

        setLoading(false);
      } catch (err) {
        setError(String(err?.message || err));
        setLoading(false);
      }
    }

    init();

    return () => {
      canceled = true;
      isMapInitialized.current = false;
      try {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };
  }, []);

  // Handle class selection changes - only update control, don't recreate map
  useEffect(() => {
    if (!mapRef.current || !controlRef.current || !isMapInitialized.current)
      return;

    const L = window.L;
    const cls =
      LULC_CLASSES.find((c) => c.id === selectedClassId) || LULC_CLASSES[0];

    try {
      // Remove old control
      mapRef.current.removeControl(controlRef.current);

      // Create new control with updated color
      const newControl = createDrawingControl(
        mapRef.current,
        drawnRef.current,
        cls.color
      );
      controlRef.current = newControl;

      // Add new control
      mapRef.current.addControl(newControl);
    } catch (err) {
      console.error("Error updating drawing control:", err);
    }
  }, [selectedClassId]);

  // Handle editing state changes
  useEffect(() => {
    if (!drawnRef.current) return;

    drawnRef.current.eachLayer((layer) => {
      try {
        if (layer._customId === editingId) {
          if (layer.editing && layer.editing.enable) layer.editing.enable();
        } else {
          if (layer.editing && layer.editing.disable) layer.editing.disable();
        }
      } catch (err) {
        console.error("Error toggling layer editing:", err);
      }
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

  // Class properties mapping
  const CLASS_PROPERTIES = {
    agriculture: {
      Classname: "Agricultural Lands",
      Classvalue: 5,
      RED: 170,
      GREEN: 255,
      BLUE: 0,
    },
    water: {
      Classname: "Water Bodies",
      Classvalue: 1,
      RED: 0,
      GREEN: 112,
      BLUE: 255,
    },
    forest: {
      Classname: "Forest",
      Classvalue: 4,
      RED: 76,
      GREEN: 115,
      BLUE: 0,
    },
    builtup: {
      Classname: "Buildings",
      Classvalue: 2,
      RED: 255,
      GREEN: 0,
      BLUE: 0,
    },
    barren: {
      Classname: "Barren Lands",
      Classvalue: 3,
      RED: 14,
      GREEN: 195,
      BLUE: 177,
    },
  };

  async function exportGeoJSON() {
    if (!drawnRef.current) return;

    setExportStatus({ loading: true, success: false, error: null });

    try {
      const features = [];
      drawnRef.current.eachLayer((layer) => {
        const feat = layer.feature
          ? JSON.parse(JSON.stringify(layer.feature))
          : layer.toGeoJSON();
        const lulcClass = feat.properties.lulc_class || "unclassified";

        const classProps = CLASS_PROPERTIES[lulcClass] || {
          Classname: "Unknown",
          Classvalue: 0,
          RED: 200,
          GREEN: 200,
          BLUE: 200,
        };

        // Convert Polygon to MultiPolygon if necessary
        const geometry = feat.geometry;
        if (geometry.type === "Polygon") {
          geometry.type = "MultiPolygon";
          geometry.coordinates = [geometry.coordinates];
        }

        features.push({
          type: "Feature",
          properties: {
            ...classProps,
            Count: 0,
          },
          geometry,
        });
      });

      const featureCollection = { type: "FeatureCollection", features };

      // Convert to Blob
      const blob = new Blob([JSON.stringify(featureCollection)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("training_file", blob, `lulc_project_${id}.geojson`);
      formData.append("project_id", id);
      formData.append("created_at", new Date().toISOString());

      const response = await fetch(
        `http://192.168.29.152:8000/api/projects/${id}/lulc/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP ${response.status} - ${errorText}`);
      }

      // const result = await response.json();
      // console.log("Export successful:", result);

      // //  Set success status
      // setExportStatus({ loading: false, success: true, error: null });

      // //  ADD: Trigger automatic refresh after successful export
      // if (refreshProject) {
      //   refreshProject();
      // }

      // //  ADD: Auto-hide success status after 5 seconds
      // setTimeout(() => {
      //   setExportStatus({ loading: false, success: false, error: null });
      // }, 5000);

      const result = await response.json();
      console.log("Export successful:", result);

      // ✅ Set success status
      setExportStatus({ loading: false, success: true, error: null });

      // ✅ Update tags immediately without refreshing
      if (updateProjectTags && !project?.tags?.includes("LULC")) {
        updateProjectTags("LULC");
      }

      // ❌ REMOVE this - we don't want full refresh because it clears polygons
      // if (refreshProject) {
      //   refreshProject();
      // }

      // ✅ Auto-hide success message after 5 seconds
      setTimeout(() => {
        setExportStatus({ loading: false, success: false, error: null });
      }, 5000);

      // Optional: Download locally
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `lulc_polygons_project_${id}.geojson`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export failed:", error);
      setExportStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to export data",
      });

      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setExportStatus({ loading: false, success: false, error: null });
      }, 5000);
    }
  }

  function clearAll() {
    if (drawnRef.current) {
      drawnRef.current.clearLayers();
    }
    setPolygonsList([]);
    // Reset export status when clearing
    setExportStatus({ loading: false, success: false, error: null });
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
    if (removed) {
      setPolygonsList((prev) => prev.filter((p) => p.id !== item.id));
    }
  }

  return (
    <div
      className="font-sans w-full flex bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 60px)" }}
      >
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            LULC Training
          </h1>
          <p className="text-slate-600 text-xs font-medium">
            Create training polygons for land use classification
          </p>
        </div>

        {/* Status indicator */}
        <div
          className={`p-3 rounded-lg border ${
            loading
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : wmsLoaded
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                loading
                  ? "bg-yellow-500 animate-pulse"
                  : wmsLoaded
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium">
              {loading
                ? "Loading map and WMS layer..."
                : wmsLoaded
                ? "Map ready - Drawing tools active"
                : "Map ready - WMS layer failed"}
            </span>
          </div>
        </div>

        {/* Export Success/Error Status */}
        {(exportStatus.success || exportStatus.error) && (
          <div
            className={`p-3 rounded-lg border ${
              exportStatus.success
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  exportStatus.success ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {exportStatus.success
                  ? "LULC training data exported successfully!"
                  : `Export failed: ${exportStatus.error}`}
              </span>
            </div>
          </div>
        )}

        {/* Class Selection */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-100 flex-shrink-0">
          <label className="block text-sm font-semibold text-slate-800 mb-3">
            Land Cover Class
          </label>
          <div className="space-y-2">
            {LULC_CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`w-full flex items-center gap-2 p-1 pr-2 rounded-lg transition-all duration-200 border ${
                  selectedClassId === cls.id
                    ? "bg-white border-blue-400 shadow-md ring-1 ring-blue-400/30"
                    : "bg-white/60 border-transparent hover:bg-white/80 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-4 h-2 rounded-md shadow-sm transition-all duration-200 ${
                    selectedClassId === cls.id
                      ? "ring-2 ring-blue-400/40"
                      : "ring-1 ring-white/80"
                  }`}
                  style={{ background: cls.color }}
                />
                <span
                  className={`font-medium text-sm text-left flex-1 transition-colors ${
                    selectedClassId === cls.id
                      ? "text-blue-900"
                      : "text-slate-700"
                  }`}
                >
                  {cls.label}
                </span>
                {selectedClassId === cls.id && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={exportGeoJSON}
            disabled={
              loading || polygonsList.length === 0 || exportStatus.loading
            }
            className={`flex-1 font-medium py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm ${
              exportStatus.success
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                : exportStatus.error
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            } disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white`}
          >
            {exportStatus.loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </div>
            ) : exportStatus.success ? (
              `✓ Exported (${polygonsList.length})`
            ) : exportStatus.error ? (
              `✗ Export Failed (${polygonsList.length})`
            ) : (
              `Export to API (${polygonsList.length})`
            )}
          </button>
          <button
            onClick={clearAll}
            disabled={loading || polygonsList.length === 0}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Guide */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span className="font-semibold text-amber-800 text-base">
              Quick Guide
            </span>
          </div>
          <ul className="text-xs text-amber-700 space-y-2 leading-relaxed">
            <li>• Wait for map to load completely</li>
            <li>• Select a land cover class above</li>
            <li>• Use the polygon tool in the map toolbar</li>
            <li>• Draw training areas on the map</li>
            <li>• Export when ready for ML training</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="font-medium text-red-800 text-sm">Error</span>
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

      {/* Map Container */}
      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-700 font-medium">
                {isMapInitialized.current
                  ? "Loading WMS layer..."
                  : "Initializing map..."}
              </span>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden shadow-2xl"
          style={{ minHeight: 400, zIndex: 0 }}
        />
      </main>
    </div>
  );
}
