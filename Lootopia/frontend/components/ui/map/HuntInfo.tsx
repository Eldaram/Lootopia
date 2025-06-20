import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { getSession } from '@/app/src/services/authService';

type Hunt = {
  id: number;
  title: string;
  description?: string;
  duration: string; 
  image?: string;
  gain?: number;
  tag?: string;
};

type User = {
  money: number; 
};

export default function HuntInfo() {
  const { id } = useLocalSearchParams();
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null); 
  const { theme } = useTheme();
  const themeColors = Colors[theme];

  useEffect(() => {
    const fetchUserSession = async () => {
      const session = await getSession();
      if (session && session.id) {
        fetchUserData(session.id);
      }
    };

    const fetchUserData = async (userId: string) => {
      try {
        const res = await fetch(`http://192.168.102.109:3000/api/users/${id}`);
        if (!res.ok) throw new Error('Erreur de récupération de l\'utilisateur');
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserSession(); 
  }, []);

  useEffect(() => {
    if (id) {
      async function fetchHunt() {
        try {
          const res = await fetch(`http://192.168.102.109:3000/api/hunts/${id}`);
          if (!res.ok) throw new Error('Erreur de récupération de la chasse');
          const data: Hunt = await res.json();
          setHunt(data);

          const durationDate = new Date(data.duration);
          const currentTime = new Date();
          
          if (durationDate > currentTime) {
            const difference = durationDate.getTime() - currentTime.getTime();
            setRemainingTime(difference);
          } else {
            setRemainingTime(0); 
          }
        } catch (err) {
          console.error(err);
        }
      }

      fetchHunt();
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingTime !== null && remainingTime > 0) {
        setRemainingTime((prev) => {
          if (prev !== null) {
            return prev - 1000; 
          }
          return 0; 
        });
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (time: number): string => {
    if (time <= 0) return '00:00:00'; 
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (!hunt || user === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(44, 206, 210, 0.5)' }]}>
      <Text style={styles.title}>{hunt.title}</Text>
      <View style={styles.detailsContainer}>
      <Text style={styles.details}>🪙 {user.money}</Text>
      <Text style={styles.details}>⏳ {formatTime(remainingTime ?? 0)}</Text>
      </View>
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
    textAlign: 'right',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
