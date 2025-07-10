import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
  lat: number;
  lon: number;
  radius: number;
  onChange: (lat: number, lon: number, radius: number) => void;
}

const MapSelector: React.FC<Props> = ({ lat, lon, radius, onChange }) => {
  const DraggableMarker = () => {
    const map = useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng, radius);
      },
    });

    useEffect(() => {
      map.setView([lat, lon], 13);
    }, [lat, lon]);

    return (
      <>
        <Marker
          position={[lat, lon]}
          draggable
          eventHandlers={{
            dragend(e) {
              const pos = e.target.getLatLng();
              onChange(pos.lat, pos.lng, radius);
            },
          }}
          icon={L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        />
        <Circle center={[lat, lon]} radius={radius} pathOptions={{ color: 'blue' }} />
      </>
    );
  };

  return (
    <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
      <MapContainer center={[lat, lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
