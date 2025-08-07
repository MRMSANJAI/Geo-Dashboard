import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import * as toGeoJSON from "@tmcw/togeojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [uploadedLayer, setUploadedLayer] = useState(null);
  const mapRef = useRef();
  const fileRef = useRef();

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

  const handleConfirmUpload = () => {
    if (!geoJsonData) {
      alert("Please select a KML file first.");
      return;
    }

    const confirmUpload = window.confirm(
      "Are you sure you want to upload this file to the server?"
    );
    if (confirmUpload) {
      // ✅ API call placeholder
      alert("KML file uploaded to backend!");
    }
  };

  const handleClear = () => {
    setGeoJsonData(null);
    setUploadedLayer(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  //className="bg-gray-50 p-2 rounded-lg shadow-inner

  return (
    <div className="flex flex-col font-sans gap-4 px-8 h-100% mt-5 bg-gray-100 rounded-lg shadow-inner p-2">
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
            onClick={handleConfirmUpload}
            disabled={!geoJsonData}
            className={`px-4 py-2 rounded text-white ${
              geoJsonData
                ? "bg-green-600 hover:bg-green-700"
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
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Map */}
      <div>
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

          {geoJsonData && (
            <>
              <FitBounds geoJson={geoJsonData} />
              <GeoJSONComponent data={geoJsonData} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
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
