import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import type { LocationObjectCoords } from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Permission refusée");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords); 
    })();
  }, []);

  if (!location) return <ActivityIndicator size="large" />;

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      </head>
      <body style="margin:0">
        <div id="map" style="height:100vh;width:100vw;"></div>
        <script>
          var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
          }).addTo(map);
          L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
            .bindPopup('Vous êtes ici').openPopup();
        </script>
      </body>
    </html>
  `;

  return <WebView originWhitelist={['*']} source={{ html }} />;
}
