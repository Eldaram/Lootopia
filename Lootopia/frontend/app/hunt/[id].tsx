import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import type { LocationObjectCoords } from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          🌐 La carte n’est pas disponible sur le web. Veuillez utiliser l’application sur un smartphone.
        </Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>❌ Permission de localisation refusée.</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Chargement de votre position...</Text>
      </View>
    );
  }

  // HTML content for the leaflet map
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
          var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 17);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
            .bindPopup('Vous êtes ici').openPopup();
        </script>
      </body>
    </html>
  `;

  return <WebView originWhitelist={['*']} source={{ html }} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
});
