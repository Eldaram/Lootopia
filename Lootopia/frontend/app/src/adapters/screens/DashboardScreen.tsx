import { useEffect, useState } from "react";
import { getSession } from "../../services/authService";
import '../../../src/styles.css';
import { Text, ScrollView, View } from "react-native";

export const DashboardScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session);

      if (session?.role === 'admin') {
        try {
          const res = await fetch("http://localhost:3000/api/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Erreur de récupération des utilisateurs");
          }

          const data = await res.json();
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Les données récupérées ne sont pas un tableau", data);
          }
        } catch (err) {
          console.error("Erreur de récupération des utilisateurs", err);
        }
      }
    };

    fetchSession();
  }, []);

  if (!user) return <Text>Chargement...</Text>;

  if (user.role !== "admin") {
    return <Text className="denied">Vous n'avez pas l'autorisation d'accéder à cette page</Text>;
  }

  return (
    <ScrollView className="container">
      <Text className="title">Gestion des utilisateurs</Text>

      <View style={{ marginTop: 20, backgroundColor: '#f2f2f2' }}>
        {/* Table header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#f2f2f2', padding: 10 }}>
          <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Nom</Text>
          <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Email</Text>
          <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Rôle</Text>
        </View>

        {/* Table body */}
        {Array.isArray(users) && users.length > 0 ? (
          users.map((u, index) => (
            <View key={index} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{ flex: 1, textAlign: 'center' }}>{u.username}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>{u.email}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>{u.role}</Text>
            </View>
          ))
        ) : (
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <Text style={{ flex: 1, textAlign: 'center' }}>Aucun utilisateur trouvé.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
