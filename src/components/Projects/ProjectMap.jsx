import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as toGeoJSON from '@tmcw/togeojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const KMLMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [uploadedLayer, setUploadedLayer] = useState(null);
  const mapRef = useRef();
  const fileRef = useRef();

  const handleKmlUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.kml')) {
      alert('Please upload a valid .kml file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const parser = new DOMParser();
      const kml = parser.parseFromString(e.target.result, 'text/xml');
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

    const confirmUpload = window.confirm("Are you sure you want to upload this file to the server?");
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

  return (
    <div className="flex flex-col gap-4 px-4 h-100% mt-5">
      {/* Buttons */}
      <div className="flex gap-4">
        <input
          type="file"
          accept=".kml"
          onChange={handleKmlUpload}
          ref={fileRef}
          className="text-sm text-gray-700"
        />
        <button
          onClick={handleConfirmUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload to Server
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{  height: "75vh", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {geoJsonData && (
          <>
            <FitBounds geoJson={geoJsonData} />
            <GeoJSONComponent data={geoJsonData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

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

export default KMLMap;
