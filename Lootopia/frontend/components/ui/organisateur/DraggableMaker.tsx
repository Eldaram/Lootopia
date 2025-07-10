import { Marker, useMapEvents } from 'react-leaflet';
import { useRef, useEffect, useState } from 'react';
import L, { LatLngLiteral } from 'leaflet';

interface DraggableMarkerProps {
  position: LatLngLiteral;
  onDragEnd: (lat: number, lng: number) => void;
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({ position, onDragEnd }) => {
  const markerRef = useRef<L.Marker>(null);
  const [pos, setPos] = useState(position);

  // ✅ Met à jour le marqueur si la prop change
  useEffect(() => {
    setPos(position);
  }, [position]);

  // ✅ Permet de déplacer le marqueur par clic sur la carte
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos({ lat, lng });
      onDragEnd(lat, lng);
    }
  });

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.dragging?.enable();
    }
  }, []);

  return (
    <Marker
      position={pos}
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            const newPos = marker.getLatLng();
            setPos(newPos);
            onDragEnd(newPos.lat, newPos.lng);
          }
        }
      }}
    />
  );
};

export default DraggableMarker;
