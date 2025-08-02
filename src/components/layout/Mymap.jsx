// src/pages/MyMap.jsx

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as toGeoJSON from '@tmcw/togeojson';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Predefined city coordinates
const locationOptions = {
  Chennai: [13.0827, 80.2707],
  Bengaluru: [12.9716, 77.5946],
  Delhi: [28.6139, 77.2090],
  Mumbai: [19.0760, 72.8777],
  London: [51.5074, -0.1278],
};

// To update map center when city changes
const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
};

const MyMap = () => {
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [geoData, setGeoData] = useState(null);
  const [fileError, setFileError] = useState('');
  const mapRef = useRef();

  const center = locationOptions[selectedCity];

  const icon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Auto-fit bounds when geoData is updated
  useEffect(() => {
    if (geoData && mapRef.current) {
      const layer = L.geoJSON(geoData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [geoData]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      try {
        if (file.name.endsWith('.kml')) {
          const parser = new DOMParser();
          const kml = parser.parseFromString(text, 'text/xml');
          const converted = toGeoJSON.kml(kml);
          setGeoData(converted);
          setFileError('');
        } else if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          setGeoData(parsed);
          setFileError('');
        } else {
          setFileError('Unsupported file type. Use .kml, .geojson, or .json');
        }
      } catch (err) {
        setFileError('Error parsing file');
      }
    };

    reader.readAsText(file);
  };

  return (
   <div className="flex flex-col gap-4 px-4 h-full">
  {/* Controls */}
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    {/* City Dropdown */}
    <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
      className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
    >
      {Object.keys(locationOptions).map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>

    {/* File Uploader */}
    <input
      type="file"
      accept=".kml,.geojson,.json"
      onChange={handleFileUpload}
      className="text-sm text-[#333333] bg-white border border-[#2EA7E0] px-3 py-2 rounded-md cursor-pointer transition duration-200 hover:bg-[#2EA7E0]/10"
    />
  </div>

  {/* Error Display */}
  {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

  {/* Map Container */}
  <MapContainer
    center={center}
    zoom={13}
    style={{ height: '75vh', width: '100%' }}
    whenCreated={(mapInstance) => {
      mapRef.current = mapInstance;
    }}
  >
    <ChangeMapCenter center={center} />
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    />

    {/* Marker for selected city */}
    <Marker position={center} icon={icon}>
      <Popup>{selectedCity} Location</Popup>
    </Marker>

    {/* Display uploaded file as GeoJSON */}
    {geoData && (
      <GeoJSON
        data={geoData}
        style={{
          color: '#4CAF50', // softer green overlay
          weight: 2,
          fillOpacity: 0.4,
        }}
        onEachFeature={(feature, layer) => {
          const name = feature?.properties?.name || 'Unknown';
          layer.bindPopup(name);
        }}
      />
    )}
  </MapContainer>
</div>

  );
};

export default MyMap;
