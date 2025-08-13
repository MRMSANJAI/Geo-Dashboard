import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const { BaseLayer, Overlay } = LayersControl;

export default function MapWithLayers() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar with modern scrollbar */}
  <aside
  className="w-96 bg-white/95 backdrop-blur-sm shadow-xl border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
  style={{ maxHeight: "calc(100vh - 60px)" }}
>
        <h2 className="font-bold text-lg">Layers & Controls</h2>
        <p className="text-sm text-slate-500">
          Toggle between different basemaps or show/hide overlays.
        </p>
      </aside>

      {/* Main Map */}
      <main className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-700 font-medium">Loading map...</span>
            </div>
          </div>
        )}

        <MapContainer
          ref={containerRef}
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          style={{ height: "calc(100vh - 60px)", width: "100%" }}
          className="rounded-tl-3xl overflow-hidden shadow-2xl"
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
        </MapContainer>
      </main>
    </div>
  );
}