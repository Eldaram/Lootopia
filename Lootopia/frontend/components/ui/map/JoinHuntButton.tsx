import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { getSession } from "@/app/src/services/authService";

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

export default function JoinHuntButton({ item }: { item: Hunt }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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

  const handleJoin = async () => {
    if (!userId) {
      Alert.alert("Erreur", "Vous devez être connecté pour participer.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/hunts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          hunt_id: item.id,
          statut: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la participation à la chasse.");
      }

      router.push({ pathname: '/hunt/[id]', params: { id: item.id.toString() } });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de rejoindre la chasse.");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleJoin}>
        <Text style={styles.buttonText}>Participer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
