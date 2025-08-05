import React, { useState, useRef, useEffect, use } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as toGeoJSON from '@tmcw/togeojson';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import { fetchDashboardData } from '../../services/api';  

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

// Auto-fit bounds when geoData changes
const FitBoundsOnGeoJSON = ({ geoData }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoData) return;

    const geojsonLayer = L.geoJSON(geoData);
    const bounds = geojsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoData, map]);

  return null;
};

const MyMap = () => {
  const [selectedCity, setSelectedCity] = useState(0);
  const [geoData, setGeoData] = useState(null);
  const [fileError, setFileError] = useState('');
  const mapRef = useRef();

  const [mapData, setMapData] = useState(null);
  useEffect(() => {
      const loadData = async () => {
        const data = await fetchDashboardData();
        console.log("📦 Data received");
        if (data) setMapData(data.projects);
      };

  loadData();
  }, []);



  const center = mapData && mapData.length > 0
    ? mapData[selectedCity].location // Default to first project's location
    : locationOptions[selectedCity] || [13.0827, 80.2707]; // Fallback to Chennai

  const icon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
    <div className="flex flex-col gap-4 px-4 h-full mt-5">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
        {mapData && (
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2 rounded-md bg-white text-[#333333] border border-[#2EA7E0] focus:ring-2 focus:ring-[#2EA7E0] transition duration-200"
        >
          <option value="0">All Projects</option>
          {Array.from(new Set(mapData.map(project => project.title))).map((project, index) => (
            <option key={project} value={index}>
              {project}
            </option>
          ))}
        </select>
        )}

        <input
          type="file"
          accept=".kml,.geojson,.json"
          onChange={handleFileUpload}
          className="text-sm text-[#333333] bg-white border border-[#2EA7E0] px-3 py-2 rounded-md cursor-pointer transition duration-200 hover:bg-[#2EA7E0]/10"
        />
      </div>

      {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

      {/* Map */}
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

        {/* City marker */}
        {/* <Marker position={center} icon={icon}>
          <Popup>{selectedCity} Location</Popup>
        </Marker> */}

          {mapData && mapData.map((project, idx) => (
          <Marker key={idx} position={project.location}>
          <Popup>
          <strong>{project.title}</strong><br />
          Status: {project.status ? '✅ Active' : '❌ Inactive'}<br />
          Date: {project.date}<br />
          <a href={project.endpoint} rel="noopener noreferrer">View Project</a>
          </Popup>
          </Marker>
          ))}

        {/* GeoJSON */}
        {geoData && (
          <>
            <GeoJSON
              key={JSON.stringify(geoData)} // Ensures re-render on new file
              data={geoData}
              style={{ color: '#4CAF50', weight: 2, fillOpacity: 0.4 }}
              onEachFeature={(feature, layer) => {
                const name = feature?.properties?.name || 'Unknown';
                layer.bindPopup(name);
              }}
            />
            <FitBoundsOnGeoJSON geoData={geoData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MyMap;
