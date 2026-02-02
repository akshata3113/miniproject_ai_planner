import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ lat, lon, place, multipleCoords }) {
  // If multipleCoords exists, use it
  const markers = multipleCoords?.length > 0
    ? multipleCoords
    : lat && lon
      ? [{ lat, lon, label: place }]
      : [];

  if (!markers || markers.length === 0) return <p>No location selected.</p>;

  // Calculate center of all markers
  const avgLat =
    markers.reduce((sum, m) => sum + parseFloat(m.lat), 0) / markers.length;
  const avgLon =
    markers.reduce((sum, m) => sum + parseFloat(m.lon), 0) / markers.length;

  return (
    <div style={{ width: "100%", height: "350px", marginTop: "20px" }}>
      <MapContainer
        center={[avgLat, avgLon]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]} icon={customIcon}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
