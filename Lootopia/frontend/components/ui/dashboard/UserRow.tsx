import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ToggleSwitch } from "@/components/ui/dashboard/ToggleSwitch"; 
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/constants/ThemeProvider'; 
import { Colors } from "@/constants/Colors";

interface UserRowProps {
  user: any;
  onToggleStatus: (userId: number, currentStatus: number) => void;
  onChangeRole: (userId: number, newRole: string) => void;
  onBanClick: (userId: number) => void;
  onUnbanSuccess: (userId: number) => void;
}

export const UserRow = ({
  user,
  onToggleStatus,
  onChangeRole,
  onBanClick,
  onUnbanSuccess,
}: UserRowProps) => {
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 

  const [remainingTime, setRemainingTime] = useState<string>("");
  const [interval, setIntervalState] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user.disabled_start || !user.disabled_end) return;

    const start = new Date(user.disabled_start).getTime();
    const end = new Date(user.disabled_end).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end)) return;
    if (now >= end) {
      setRemainingTime("");
      return;
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setRemainingTime("");
        if (interval) {
          clearInterval(interval);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setRemainingTime(
        `${days}j ${hours}h ${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`
      );
    };

    updateRemainingTime();

    const newInterval = setInterval(updateRemainingTime, 1000);
    setIntervalState(newInterval);

    return () => clearInterval(newInterval);

  }, [user.disabled_start, user.disabled_end]);

  const handleUnbanClick = async () => {
    const res = await fetch(`http://localhost:3000/api/users?id=${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disabled_start: null,
        disabled_end: null,
      }),
    });

    if (!res.ok) throw new Error("Erreur lors du débannissement");

    onUnbanSuccess(user.id);
    setRemainingTime("");
    if (interval) clearInterval(interval);
  };

  return (
    <View style={[styles.row, { backgroundColor: themeColors.cardBackground }]}>
      <View style={styles.cell}>
        <View style={styles.toggleContainer}>
          <ToggleSwitch
            checked={user.status === 1}
            onChange={() => onToggleStatus(user.id, user.status)}
          />
          {!remainingTime ? (
            <TouchableOpacity style={[styles.banButton, { backgroundColor: themeColors.warning }]} onPress={() => onBanClick(user.id)}>
              <Text style={[styles.banButtonText, { color: themeColors.text }]}>Bannir</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.banInfo}>
              <Text style={[styles.banTimer, { color: themeColors.warning }]}>⏳ {remainingTime}</Text>
              <TouchableOpacity style={[styles.unbanButton, { backgroundColor: themeColors.success }]} onPress={handleUnbanClick}>
                <Text style={styles.unbanButtonText}>Débannir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cell}>
        <Text style={{ color: themeColors.text }}>{user.username}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={{ color: themeColors.text }}>{user.email}</Text>
      </View>
      <View style={styles.cell}>
        <Picker
          selectedValue={user.role}
          onValueChange={(value) => onChangeRole(user.id, value)}
          style={[styles.rolePicker, { backgroundColor: themeColors.cardBackground, color: themeColors.text, borderColor: themeColors.background }]}
        >
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Modérateur" value="moderator" />
          <Picker.Item label="Organisateur" value="organizer" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  banButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  banButtonText: {
    fontSize: 16,
  },
  banInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  banTimer: {
    marginRight: 8,
    fontSize: 14,
  },
  unbanButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  unbanButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  rolePicker: {
    height: 50,
    borderRadius: 8,
    padding: 10,
    borderWidth: 2,
  },
});

