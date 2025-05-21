import { ToggleSwitch } from "@/components/ui/dashboard/ToggleSwitch";

interface UserRowProps {
  user: any;
  onToggleStatus: (userId: number, currentStatus: number) => void;
  onChangeRole: (userId: number, newRole: string) => void;
  onBanClick: (userId: number) => void;
}

export const UserRow = ({ user, onToggleStatus, onChangeRole, onBanClick }: UserRowProps) => {
  return (
    <div className="dashboard-table-row">
      <span className="dashboard-cell">
        <ToggleSwitch
          checked={user.status === 1}
          onChange={() => onToggleStatus(user.id, user.status)}
        />
        <button className="ban-button" onClick={() => onBanClick(user.id)}>
          Bannir
        </button>
      </span>
      <span className="dashboard-cell">{user.username}</span>
      <span className="dashboard-cell">{user.email}</span>
      <span className="dashboard-cell">
        <select
          value={user.role}
          onChange={(e) => onChangeRole(user.id, e.target.value)}
          className="role-select"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Modérateur</option>
          <option value="organizer">Organisateur</option>
        </select>
      </span>
    </div>
  );
};
