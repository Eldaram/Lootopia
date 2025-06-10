import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { UserRow } from "@/components/ui/dashboard/UserRow";
import { BanUserModal } from "@/components/ui/dashboard/BanUserModal";
import { getSession } from "@/app/src/services/authService";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors'; 

export const DashboardScreen = () => {
  const { theme } = useTheme(); 
  const themeColors = Colors[theme];

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [banModalUserId, setBanModalUserId] = useState<number | null>(null);
  const [banEndDate, setBanEndDate] = useState<string>("");

  const handleToggleStatus = async (userId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const res = await fetch(`http://localhost:3000/api/users?id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut");
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    const res = await fetch(`http://localhost:3000/api/users?id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du rôle");
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session);
      if (session?.role === "admin") {
        const res = await fetch("http://localhost:3000/api/users");
        if (!res.ok) throw new Error("Erreur de récupération des utilisateurs");
        const data = await res.json();
        const normalizedUsers = data.map((u: any) => ({
          ...u,
          disabled_start: u.disabled_start ? new Date(u.disabled_start).toISOString() : null,
          disabled_end: u.disabled_end ? new Date(u.disabled_end).toISOString() : null,
        }));
        setUsers(normalizedUsers);
      }
    };
    fetchSession();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === (filterStatus === "active" ? 0 : 1);
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleBanUser = async () => {
    if (!banModalUserId || !banEndDate) return;
    const now = new Date().toISOString();
    const res = await fetch(`http://localhost:3000/api/users?id=${banModalUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disabled_start: now,
        disabled_end: banEndDate,
      }),
    });
    if (!res.ok) throw new Error("Erreur lors du bannissement");
    const updatedUsers = users.map(user =>
      user.id === banModalUserId ? { ...user, disabled_start: now, disabled_end: banEndDate } : user
    );
    setUsers(updatedUsers);
    setBanModalUserId(null);
    setBanEndDate("");
  };

  if (!user) return <Text style={{ color: themeColors.text }}>Chargement...</Text>;
  if (user.role !== "admin") return <Text style={[styles.denied, { color: themeColors.text }]}>Accès refusé</Text>;

  const handleUnbanSuccess = (userId: number) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, disabled_start: null, disabled_end: null } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Gestion des utilisateurs</Text>
      <View style={styles.filtersRow}>
        <TextInput
          placeholder="Recherche"
          placeholderTextColor={themeColors.text}
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={[
            styles.filterInput,
            {
              backgroundColor: themeColors.cardBackground,
              color: themeColors.text,
              borderColor: themeColors.background,
            },
          ]}
        />
        <Picker
          selectedValue={filterRole}
          onValueChange={setFilterRole}
          style={[styles.filterPicker]}
        >
          <Picker.Item label="Tous rôles" value="all" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Modérateur" value="moderator" />
          <Picker.Item label="Organisateur" value="organizer" />
        </Picker>
        <Picker
          selectedValue={filterStatus}
          onValueChange={setFilterStatus}
          style={[styles.filterPicker]}
        >
          <Picker.Item label="Tous statuts" value="all" />
          <Picker.Item label="Actif" value="active" />
          <Picker.Item label="Inactif" value="inactive" />
        </Picker>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, { color: themeColors.text }]}>Action</Text>
        <Text style={[styles.columnHeader, { color: themeColors.text }]}>Nom</Text>
        <Text style={[styles.columnHeader, { color: themeColors.text }]}>Email</Text>
        <Text style={[styles.columnHeader, { color: themeColors.text }]}>Rôle</Text>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserRow
            user={item}
            onToggleStatus={handleToggleStatus}
            onChangeRole={handleChangeRole}
            onBanClick={setBanModalUserId}
            onUnbanSuccess={handleUnbanSuccess}
          />
        )}
        ListEmptyComponent={<Text style={{ color: themeColors.text }}>Aucun utilisateur trouvé.</Text>}
      />

      <BanUserModal
        isOpen={banModalUserId !== null}
        endDate={banEndDate}
        onEndDateChange={setBanEndDate}
        onCancel={() => {
          setBanModalUserId(null);
          setBanEndDate("");
        }}
        onConfirm={handleBanUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  denied: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  filterPicker: {
    flex: 0.9,
    height: Platform.OS === "web" ? 40 : 50,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  columnHeader: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
});
export default DashboardScreen;