import { useEffect, useState } from "react";
import { getSession } from "../../services/authService";
import '../../../src/dashboard.css';
import { Text, ScrollView } from "react-native";

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
      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u, index) => (
              <tr key={index}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Aucun utilisateur trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </ScrollView>
  );
};
