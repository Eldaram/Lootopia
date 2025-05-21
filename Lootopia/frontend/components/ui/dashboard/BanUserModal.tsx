interface BanUserModalProps {
  isOpen: boolean;
  duration: number;
  onDurationChange: (value: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const BanUserModal = ({
  isOpen,
  duration,
  onDurationChange,
  onCancel,
  onConfirm,
}: BanUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bannir l'utilisateur</h2>
        <label>
          Durée en minutes :
          <input
            type="number"
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            min={1}
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
