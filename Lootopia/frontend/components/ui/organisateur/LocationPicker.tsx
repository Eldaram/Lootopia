// components/LocationPicker.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import DraggableMarker from '@/components/ui/organisateur/DraggableMaker';
import type { LatLngLiteral } from 'leaflet';

interface LocationPickerProps {
  location: string;
  latitude: number;
  longitude: number;
  radius: number;
  unit: 'm' | 'km';
  onLocationChange: (lat: number, lng: number, radius: number, unit: 'm' | 'km') => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  radius,
  unit,
  onLocationChange
}) => {
  const [position, setPosition] = useState<LatLngLiteral>({ lat: latitude, lng: longitude });
  const [circleRadius, setCircleRadius] = useState<number>(radius);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng, circleRadius, unit);
    }
  });

  useEffect(() => {
    onLocationChange(position.lat, position.lng, circleRadius, unit);
  }, [circleRadius, unit]);

  return (
    <>
     <DraggableMarker
        position={{ lat: latitude, lng: longitude }}
        onDragEnd={(lat, lng) => onLocationChange(lat, lng, radius, unit)}
      />
      <Circle
        center={position}
        radius={radius * 1000}
      />
    </>
  );
};

export default LocationPicker;
