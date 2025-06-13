import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Hunt = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  // TODO: récupérer l'image depuis l'API
  image?: string;        
  gain?: number;         
  tag?: string;    
};

export default function HuntsScreen() {
  const [hunts, setHunts] = useState<Hunt[]>([]);

  useEffect(() => {
    async function fetchHunts() {
      try {
        const res = await fetch("http://localhost:3000/api/hunts");
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
  
    console.log(`ID: ${item.id}, Duration: ${item.duration}, Days Left: ${daysLeft}`);
  
    return (
      <View style={styles.card}>
        <Text style={styles.id}>#{item.id}</Text>
  
        <View style={styles.cardRow}>
          <View style={[styles.circlePlaceholder, { backgroundColor: circleColor }]} />
          <View style={styles.rightContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description || 'Aucune description'}</Text>
  
            <View style={styles.gainContainer}>
              <Text style={styles.gainText}>
                {item.gain ?? 0} 👑
              </Text>

              <Text style={styles.duration}>
              ⏳ {getDaysLeft(item.duration)} j
              </Text>
  
              {item.tag && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              )}
            </View>
  
            <TouchableOpacity style={styles.button}>
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
    <View style={{ flex: 1 }}>
      <Text style={styles.titlePage}>Chasses disponibles 🟢</Text>
      <FlatList
        data={hunts}
        renderItem={({ item, index }) => renderItem({ item, index })}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
    fontSize: 22,
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
  },
  id: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: 12,
    color: '#aaa',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  circlePlaceholder: {
    height: 200,
    width: 200,
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
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'left',
  },
  description: {
    fontSize: 13,
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
    fontSize: 13,
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
    fontSize: 13,
  },
  tag: {
    backgroundColor: '#4ade80',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
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
    fontSize: 13,
  },
});
