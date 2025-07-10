'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import DraggableMarker from '@/components/ui/organisateur/DraggableMaker';
import type { LatLngLiteral } from 'leaflet';
import L, { Circle as LeafletCircle } from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface Props {
  latitude: number;
  longitude: number;
  radius: number;
  unit: 'km';
  onChange: (lat: number, lng: number, radius: number, unit: 'km') => void;
}

function AutoFitCircle({
  circleRef,
  radius,
}: {
  circleRef: React.RefObject<LeafletCircle | null>;
  radius: number;
}) {
  const map = useMap();

  useEffect(() => {
    const circle = circleRef.current;
    if (!map || !circle) return;

    const bounds = circle.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, circleRef, radius]);

  return null;
}

export default function DynamicMap({ latitude, longitude, radius, unit, onChange }: Props) {
  const [position, setPosition] = useState<LatLngLiteral>({ lat: latitude, lng: longitude });
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const circleRef = useRef<LeafletCircle | null>(null);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

  useEffect(() => {
    if (hasSelectedSuggestion || !address || address.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {
        console.error('Erreur suggestions :', e);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address]);

  const handleSelectSuggestion = (suggestion: any) => {
    const newLat = parseFloat(suggestion.lat);
    const newLng = parseFloat(suggestion.lon);
    setAddress(suggestion.display_name);
    setSuggestions([]);
    setPosition({ lat: newLat, lng: newLng });
    onChange(newLat, newLng, radius, unit);
    setHasSelectedSuggestion(true);
  };  

  return (
    <div className="dynamic-map-container">
      <div className="hunt-form-field">
        <label className="hunt-form-label">📍 Localisation</label>
        <div className="address-search-container">
          <input
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setHasSelectedSuggestion(false); }}
            placeholder="Tapez une adresse (min. 3 lettres)"
            className="address-input"
            autoComplete="off"
          />
          {loadingSuggestions && <div className="suggestion-loading">⏳</div>}
          {suggestions.map((sug, i) => {
            const addr = sug.address || {};
            const road = addr.road || addr.pedestrian || '';
            const houseNumber = addr.house_number || '';
            const city = addr.city || addr.town || addr.village || '';
            const postcode = addr.postcode || '';
            const display = `${houseNumber} ${road}, ${postcode} ${city}`.trim();

            return (
              <li
                key={i}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(sug)}
              >
                {display}
              </li>
            );
          })}
        </div>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '350px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker
          position={position}
          onDragEnd={(lat, lng) => {
            setPosition({ lat, lng });
            onChange(lat, lng, radius, unit);
          }}
        />
        <Circle
          center={position}
          radius={radius * 1000}
          ref={(ref) => {
            if (ref) {
              // @ts-ignore
              circleRef.current = ref;
            }
          }}
        />
        <AutoFitCircle circleRef={circleRef} radius={radius} />
        <RecenterMap position={position} /> {/* 👈 Ajout ici */}
      </MapContainer>
    </div>
  );
}

function RecenterMap({ position }: { position: LatLngLiteral }) {
  const map = useMap();

  useEffect(() => {
    if (position && map) {
      map.setView(position); // ou map.flyTo(position, zoom)
    }
  }, [position, map]);

  return null;
}

