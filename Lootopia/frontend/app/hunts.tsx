import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';

type Hunt = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  image?: string;
  gain?: number;
  tag?: string;
};

export default function HuntsScreen() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const router = useRouter();
  const { theme } = useTheme(); 
  const themeColors = Colors[theme];

  useEffect(() => {
    async function fetchHunts() {
      try {
        const res = await fetch("http://192.168.102.109:3000/api/hunts");
        if (!res.ok) throw new Error("Erreur de récupération des chasses disponibles");
        const data: Hunt[] = await res.json();
        setHunts(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchHunts();
  }, []);

  const renderItem = ({ item, index }: { item: Hunt; index: number }) => {
    const daysLeft = getDaysLeft(item.duration);
    const circleColor = index % 2 === 0 ? '#76CDCD' : '#26474E';

    return (
      <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <Text style={styles.id}>#{item.id}</Text>

        <View style={styles.cardRow}>
          <View style={[styles.circlePlaceholder, { backgroundColor: circleColor }]} />
          <View style={styles.rightContent}>
            <Text style={[styles.title, { color: themeColors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: themeColors.text }]}>{item.description || 'Aucune description'}</Text>

            <View style={styles.gainContainer}>
              <Text style={styles.gainText}>
                {item.gain ?? 0} 👑
              </Text>

              <Text style={styles.duration}>
                ⏳ {daysLeft} j
              </Text>

              {item.tag && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push({ pathname: '/hunt/[id]', params: { id: item.id.toString() } })}
            >
              <Text style={styles.buttonText}>Participer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  function getDaysLeft(date: string): number {
    const now = new Date();
    const end = new Date(date);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.titlePage, { color: themeColors.text }]}>Chasses disponibles 🟢</Text>
      <FlatList
        data={hunts}
        renderItem={({ item, index }) => renderItem({ item, index })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={Platform.OS === 'android' ? 1 : 2} 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  titlePage: {
    fontSize: Platform.OS === 'android' ? 18 : 22, 
    fontWeight: 'bold',
    margin: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    width: Platform.OS === 'android' ? '100%' : '45%',  
    height: Platform.OS === 'android' ? 250 : 220, 
  },
  id: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: Platform.OS === 'android' ? 10 : 12,
    color: '#aaa',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  circlePlaceholder: {
    height: Platform.OS === 'android' ? 120 : 200, 
    width: Platform.OS === 'android' ? 120 : 200,
    borderRadius: 100, 
    backgroundColor: '#76CDCD',
    marginRight: 10,
  },
  rightContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: Platform.OS === 'android' ? 13 : 15,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'left',
  },
  description: {
    fontSize: Platform.OS === 'android' ? 11 : 13, 
    marginBottom: 4,
    textAlign: 'left',
  },
  duration: {
    backgroundColor: '#76CDCD',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: Platform.OS === 'android' ? 11 : 13, 
  },
  gainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  gainText: {
    backgroundColor: '#a78bfa',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: Platform.OS === 'android' ? 11 : 13, 
  },
  tag: {
    backgroundColor: '#4ade80',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: Platform.OS === 'android' ? 10 : 12, 
    fontWeight: 'bold',
    color: '#065f46',
  },
  button: {
    backgroundColor: '#f97316',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'android' ? 11 : 13, 
  },
});

