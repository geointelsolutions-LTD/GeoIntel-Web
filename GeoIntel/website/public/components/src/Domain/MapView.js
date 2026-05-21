import React, { useState, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('GeoIntel/website/public/components/src/Domain/MapView.js'), { ssr: false });

// --- GEOINTEL PROJECT LOCATIONS (Replace with your real data) ---
const GEOINTEL_PROJECTS = [
  {
    id: 1,
    position: { lat: -15.4167, lng: 28.2833 },
    title: "Lusaka Urban Mapping",
    type: "Urban Planning",
    status: "Active",
    health: "92%",
    client: "Lusaka City Council"
  },
  {
    id: 2,
    position: { lat: -12.9667, lng: 28.6333 },
    title: "Copperbelt Crop Monitor",
    type: "Precision Agriculture",
    status: "Active",
    health: "87%",
    client: "Ministry of Agriculture"
  },
  {
    id: 3,
    position: { lat: -13.1333, lng: 32.9333 },
    title: "Petauke Flood Zone",
    type: "Disaster Management",
    status: "Monitoring",
    health: "Alert",
    client: "DMMU Zambia"
  }
];

// --- MAP STYLING (Dark navy theme matching GeoIntel brand) ---
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0A1628" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0A1628" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8D9FB5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1565C0" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0D2B6B" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9CA5B3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0D2044" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#1976D2" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#1565C0" }] }
];

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '500px',
  borderRadius: '12px'
};

// Center on Zambia
const ZAMBIA_CENTER = { lat: -13.1339, lng: 27.8493 };

export default function MapView() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Load the Google Maps API using your key from .env
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map) => {
    console.log('GeoIntel Map loaded successfully');
  }, []);

  if (loadError) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Error loading Google Maps. Check your API key in .env file.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ padding: '40px', color: '#42A5F5', textAlign: 'center' }}>
        Loading GeoIntel Map Data...
      </div>
    );
  }

  return (
    <div style={{ padding: '0 32px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#FFD700', marginBottom: '8px' }}>
        LIVE MAP DATA
      </p>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
        Active Project Locations
      </h2>
      <p style={{ fontSize: '14px', color: '#90A4AE', marginBottom: '24px' }}>
        Click any pin to view project details — powered by Google Maps API
      </p>

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={ZAMBIA_CENTER}
        zoom={6}
        onLoad={onLoad}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        }}
      >
        {/* Render a marker for each GeoIntel project */}
        {GEOINTEL_PROJECTS.map((project) => (
          <Marker
            key={project.id}
            position={project.position}
            onClick={() => setSelectedProject(project)}
            label={{
              text: "📍",
              fontSize: "24px"
            }}
          />
        ))}

        {/* Show info popup when a marker is clicked */}
        {selectedProject && (
          <InfoWindow
            position={selectedProject.position}
            onCloseClick={() => setSelectedProject(null)}
          >
            <div style={{
              background: '#0D2044',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              minWidth: '200px',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              <h3 style={{ fontSize: '14px', marginBottom: '6px', color: '#42A5F5' }}>
                {selectedProject.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#90A4AE' }}>Type: {selectedProject.type}</p>
              <p style={{ fontSize: '12px', color: '#90A4AE' }}>Client: {selectedProject.client}</p>
              <p style={{ fontSize: '12px' }}>
                Status: <span style={{ color: '#4CAF50' }}>{selectedProject.status}</span>
              </p>
              <p style={{ fontSize: '12px' }}>
                Index: <strong style={{ color: '#FFD700' }}>{selectedProject.health}</strong>
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}