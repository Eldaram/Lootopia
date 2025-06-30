import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { getSession } from '@/app/src/services/authService';

const screenWidth = Dimensions.get('window').width;

interface HuntingCardProps {
  theme: typeof Colors.light;
}

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

const HuntingCard: React.FC<HuntingCardProps> = ({ theme }) => {
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const [cardWidth, setCardWidth] = useState(screenWidth * 0.4)
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.role);
        setIsLoggedIn(true);
    
        const userId = session?.user?.id;
        console.log('User ID:', userId);
      };
    
      fetchUserSession();
    }
  });


  useEffect(() => {
    async function fetchHunts() {
      try {
        const res = await fetch('http://localhost:3000/api/hunts');
        if (!res.ok) throw new Error('Erreur de récupération des chasses disponibles');
        const data: Hunt[] = await res.json();
        const now = new Date();
        const activeHunts = data.filter(hunt => new Date(hunt.duration) > now);
        setHunts(activeHunts);
      } catch (err) {
        console.error(err);
      }
    }

    fetchHunts();
  }, []);

  useEffect(() => {
    const onResize = () => {
      const newWidth = Dimensions.get('window').width;
      setCardWidth(newWidth * 0.8);
    };
    const subscription = Dimensions.addEventListener('change', onResize);
    return () => subscription.remove();
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * cardWidth, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex.current < hunts.length - 1) {
      currentIndex.current += 1;
      scrollToCard(currentIndex.current);
    }
  };

  const handlePrev = () => {
    if (currentIndex.current > 0) {
      currentIndex.current -= 1;
      scrollToCard(currentIndex.current);
    }
  };

  const getDaysLeft = (date: string): number => {
    const now = new Date();
    const end = new Date(date);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 24,
          marginBottom: 12,
          color: theme.text,
        }}
      >
        Chasses disponibles 🟢
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handlePrev}>
          <Icon name="chevron-left" size={30} color={theme.icon} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {hunts.map((item, index) => {
            const daysLeft = getDaysLeft(item.duration);
            const circleColor = index % 2 === 0 ? '#76CDCD' : '#26474E';

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: theme.cardBackground,
                  borderRadius: 12,
                  width: cardWidth,
                  height: 300,
                  margin: 15,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Text style={styles.id}>#{item.id}</Text>

                <View style={styles.cardRow}>
                  <View style={[styles.circlePlaceholder, { backgroundColor: circleColor }]} />
                  <View style={styles.rightContent}>
                    <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                      {item.description || 'Aucune description'}
                    </Text>

                    <View style={styles.gainContainer}>
                      <Text style={styles.gainText}>{item.gain ?? 0} 👑</Text>
                      <Text style={styles.duration}>⏳ {daysLeft} j</Text>
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
          })}
        </ScrollView>

        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-right" size={30} color={theme.icon} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
  duration: {
    backgroundColor: '#76CDCD',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: Platform.OS === 'android' ? 11 : 13,
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

export default HuntingCard;
