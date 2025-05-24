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
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bannir l'utilisateur</h2>
        <label>
          Fin du ban :
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="modal-input"
          />
        </label>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Confirmer</button>
          <button onClick={onCancel} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  );
};
