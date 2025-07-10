import { Colors } from "@/constants/Colors";
import { useTheme } from "@/constants/ThemeProvider";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

interface BanUserModalProps {
  isOpen: boolean;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const BanUserModal = ({
  isOpen,
  endDate,
  onEndDateChange,
  onCancel,
  onConfirm,
}: BanUserModalProps) => {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isCustomDate, setIsCustomDate] = useState(false); 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { theme } = useTheme();
    const themeColors = Colors[theme]; 

const showDatePicker = () => setDatePickerVisibility(true);
const hideDatePicker = () => setDatePickerVisibility(false);

const handleConfirm = (date: Date) => {
  onEndDateChange(date.toISOString());
  hideDatePicker();
};

  const handlePredefinedBan = (duration: string) => {
    let newEndDate = new Date();

    switch (duration) {
      case "1h":
        newEndDate.setHours(newEndDate.getHours() + 1);
        break;
      case "1j":
        newEndDate.setDate(newEndDate.getDate() + 1);
        break;
      case "1m":
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case "1a":
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
      default:
        return;
    }

    onEndDateChange(newEndDate.toISOString());
    setSelectedDuration(duration);
    setIsCustomDate(false);
  };

  const handleCustomDateToggle = () => {
    setIsCustomDate(!isCustomDate); 
    setSelectedDuration(null); 
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>Bannir l'utilisateur</Text>
          <View style={styles.predefinedButtons}>
            <TouchableOpacity
              onPress={() => handlePredefinedBan("1h")}
              style={[styles.predefinedButton, selectedDuration === "1h" && styles.selected]}
            >
              <Text style={styles.buttonText}>1 heure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePredefinedBan("1j")}
              style={[styles.predefinedButton, selectedDuration === "1j" && styles.selected]}
            >
              <Text style={styles.buttonText}>1 jour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePredefinedBan("1m")}
              style={[styles.predefinedButton, selectedDuration === "1m" && styles.selected]}
            >
              <Text style={styles.buttonText}>1 mois</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePredefinedBan("1a")}
              style={[styles.predefinedButton, selectedDuration === "1a" && styles.selected]}
            >
              <Text style={styles.buttonText}>1 an</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCustomDateToggle}
              style={[styles.predefinedButton, isCustomDate && styles.selected]}
            >
              <Icon name="calendar" size={20} color={isCustomDate ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
         
          {isCustomDate && (
            <View style={styles.customDateContainer}>
              <Text style={[styles.customDateLabel, { color: themeColors.text }]}>
                Fin du ban (date personnalisée) :
              </Text>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="modal-input"
                style={styles.dateInput}
              />
            </View>
          )}
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  predefinedButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  predefinedButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    margin: 5,
  },
  selected: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  customDateContainer: {
    marginBottom: 20,
  },
  customDateLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateInput: {
    width: 200,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

