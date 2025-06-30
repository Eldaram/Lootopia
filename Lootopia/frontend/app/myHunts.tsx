import { getSession } from '@/app/src/services/authService';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeProvider';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import JoinHuntButton from '@/components/ui/map/JoinHuntButton';

type Hunt = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  image?: string;
  gain?: number;
  max_participants?: number;
  chat_enabled?: boolean;
  search_delay?: number;
};

export default function MyHuntsScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const { theme } = useTheme(); 
  const themeColors = Colors[theme];
  const [expandedHuntIds, setExpandedHuntIds] = useState<number[]>([]);
  
    useEffect(() => {
      const fetchUserSession = async () => {
        const session = await getSession();
        if (session) {
          setUserId(session.id);
          setIsLoggedIn(true);
        } else {
          setUserId(null);
          setIsLoggedIn(false);
        }
      };
  
      fetchUserSession();
    }, []);
    useEffect(() => {
      const fetchHunts = async () => {
        if (!userId) {
          Alert.alert("Erreur", "Vous devez être connecté pour accéder à vos chasses.");
          return;
        }
    
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userId}/hunts`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des chasses.");
          }
    
          const data = await response.json();
          setHunts(data);
    
        } catch (error) {
          console.error(error);
          Alert.alert("Erreur", "Impossible de récupérer les chasses.");
        }
      };
    
      fetchHunts();
    }, [userId]);
  
    const toggleExpand = (id: number) => {
      setExpandedHuntIds((prev) =>
        prev.includes(id) ? prev.filter(hid => hid !== id) : [...prev, id]
      );
    };  
  
  const renderItem = ({ item, index }: { item: Hunt; index: number }) => {
      const daysLeft = getDaysLeft(item.duration);
      const circleColor = index % 2 === 0 ? '#76CDCD' : '#26474E';
      const isExpanded = expandedHuntIds.includes(item.id);
    
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleExpand(item.id)}
          style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
        >
          <Text style={styles.id}>#{item.id}</Text>
    
          <View style={styles.cardRow}>
            <View style={[styles.circlePlaceholder, { backgroundColor: circleColor }]} />
            <View style={styles.rightContent}>
              <Text style={[styles.title, { color: themeColors.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: themeColors.text }]}>{item.description || 'Aucune description'}</Text>
    
              <View style={styles.gainContainer}>
                <Text style={styles.gainText}>{item.gain ?? 0} 👑</Text>
                <Text style={styles.duration}>⏳ {daysLeft} j</Text>
              </View>
    
              {isExpanded && (
                <View style={[styles.expandedSection, { backgroundColor: themeColors.cardBackground }]}>
                  <Text style={[styles.extraInfo, { color: themeColors.text }]}>👥 Participants max : {item.max_participants ?? 'N/A'}</Text>
                  <Text style={[styles.extraInfo, { color: themeColors.text }]}>💬 Chat activé : {item.chat_enabled ? 'Oui' : 'Non'}</Text>
                  <Text style={[styles.extraInfo, { color: themeColors.text }]}>⏱️ Délai de recherche : {item.search_delay ?? 'N/A'} s</Text>
                </View>
              )}
    
              <JoinHuntButton item={item} />
            </View>
          </View>
        </TouchableOpacity>
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
        <Text style={[styles.titlePage, { color: themeColors.text }]}>Mes chasses 🟢</Text>
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
    expandedSection: {
      marginTop: 8,
      padding: 8,
      backgroundColor: '#e5e7eb',
      borderRadius: 8,
    },
    extraInfo: {
      fontSize: Platform.OS === 'android' ? 11 : 13,
      color: '#111827',
      marginBottom: 4,
    },  
  });
