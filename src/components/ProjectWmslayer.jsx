import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Option 1: Pure Vanilla Leaflet in React (Recommended)
export default function MyMap() {
  const { id } = useParams();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentWMSLayerRef = useRef(null);
  const [layerData, setLayerData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    mapInstanceRef.current = L.map(mapRef.current).setView([13.5, 80.1], 8);

    // Add base OSM layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    // Add layer control
    const baseLayers = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }),
      "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }),
      "Carto Light": L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      })
    };

    const overlayLayers = {
      "Labels": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    };

    L.control.layers(baseLayers, overlayLayers, {
      position: 'topright'
    }).addTo(mapInstanceRef.current);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch WMS data when ID changes
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://192.168.29.152:8000/api/projects/${id}/rasters/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLayerData(data[data.length - 1]);
        } else if (!Array.isArray(data)) {
          setLayerData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching WMS data:", err);
        setLoading(false);
      });
  }, [id]);

  // Add WMS layer when data changes
  useEffect(() => {
    if (!layerData || !mapInstanceRef.current) return;

    // Remove existing WMS layer
    if (currentWMSLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentWMSLayerRef.current);
      currentWMSLayerRef.current = null;
    }

    // Find RGB band or use default layer data
    const rgbBand = layerData.bands?.find(band => band.band_type === 'rgb');
    
    const wmsUrl = rgbBand 
      ? rgbBand.wms_url.split('?')[0]
      : layerData.wms_url?.split('?')[0];

    const layerName = rgbBand
      ? `${rgbBand.workspace}:${rgbBand.layer_name}`
      : layerData.workspace && layerData.layer_name
      ? `${layerData.workspace}:${layerData.layer_name}`
      : null;

    if (!wmsUrl || !layerName) {
      console.error('Missing WMS URL or layer name');
      return;
    }

    // Create and add WMS layer
    currentWMSLayerRef.current = L.tileLayer.wms(wmsUrl, {
      layers: layerName,
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
      attribution: 'WMS Layer'
    });

    currentWMSLayerRef.current.addTo(mapInstanceRef.current);

    // Fit to bounding box
    const bboxSource = rgbBand || layerData;
    if (bboxSource && bboxSource.bbox_minx !== undefined) {
      const bounds = [
        [bboxSource.bbox_miny, bboxSource.bbox_minx],
        [bboxSource.bbox_maxy, bboxSource.bbox_maxx]
      ];
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [layerData]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          Loading WMS data...
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
