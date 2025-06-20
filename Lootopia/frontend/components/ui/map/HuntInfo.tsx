import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';

type Hunt = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  image?: string;
  gain?: number;
  tag?: string;
};

export default function HuntInfo() {
  const { id } = useLocalSearchParams();
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const { theme } = useTheme();
  const themeColors = Colors[theme];

  useEffect(() => {
    if (id) {
      async function fetchHunt() {
        try {
          const res = await fetch(`http://192.168.102.109:3000/api/hunts/${id}`);
          if (!res.ok) throw new Error('Erreur de récupération de la chasse');
          const data: Hunt = await res.json();
          setHunt(data);
        } catch (err) {
          console.error(err);
        }
      }

      fetchHunt();
    }
  }, [id]);

  if (!hunt) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(44, 206, 210, 0.5)' }]}>
      <Text style={styles.title}>{hunt.title}</Text>
      <Text style={styles.details}>⏳:{hunt.duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
  },  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
