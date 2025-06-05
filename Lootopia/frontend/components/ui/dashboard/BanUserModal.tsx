import React, { useState } from "react";
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bannir l'utilisateur</h2>
        <div className="predefined-buttons">
          <button
            onClick={() => handlePredefinedBan("1h")}
            className={selectedDuration === "1h" ? "selected" : ""}
          >
            1 heure
          </button>
          <button
            onClick={() => handlePredefinedBan("1j")}
            className={selectedDuration === "1j" ? "selected" : ""}
          >
            1 jour
          </button>
          <button
            onClick={() => handlePredefinedBan("1m")}
            className={selectedDuration === "1m" ? "selected" : ""}
          >
            1 mois
          </button>
          <button
            onClick={() => handlePredefinedBan("1a")}
            className={selectedDuration === "1a" ? "selected" : ""}
          >
            1 an
          </button>
          
          <button onClick={handleCustomDateToggle} className={isCustomDate ? "selected" : ""}>
            <Icon name="calendar" size={20} color={isCustomDate ? 'white' : 'gray'} />
          </button>
        </div>
        {isCustomDate && (
          <div>
            <label>
              Fin du ban (date personnalisée) :
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="modal-input"
              />
            </label>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Confirmer</button>
          <button onClick={onCancel} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  );
};
