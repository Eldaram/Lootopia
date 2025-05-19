import { useEffect, useState } from "react";
import { getSession } from "../../services/authService";
import { Text, View } from "react-native";

export const DashboardScreen = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      console.log("Session récupérée dans dashboard:", session);
      setUser(session);
    };
  
    setTimeout(fetchSession, 100);
  }, []);
  

  if (!user) return <Text>Chargement...</Text>;

  return (
    <View>
      <Text>Bienvenue {user.username}</Text>
      {user.role === "admin" ? (
        <Text>Vous êtes ADMIN</Text>
      ) : (
        <Text>Vous êtes USER</Text>
      )}
    </View>
  );
};
