import { useEffect, useState } from "react";
import { ToggleSwitch } from "@/components/ui/dashboard/ToggleSwitch";

interface UserRowProps {
  user: any;
  onToggleStatus: (userId: number, currentStatus: number) => void;
  onChangeRole: (userId: number, newRole: string) => void;
  onBanClick: (userId: number) => void;
}

export const UserRow = ({ user, onToggleStatus, onChangeRole, onBanClick }: UserRowProps) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (!user.disable_start || !user.disable_time) return;

    const interval = setInterval(() => {
      const start = new Date(user.disable_start).getTime();
      const now = Date.now();
      const banDurationMs = user.disable_time * 60 * 1000;
      const end = start + banDurationMs;
      const diff = end - now;

      if (diff <= 0) {
        setRemainingTime("");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemainingTime(`${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [user.disable_start, user.disable_time]);

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
        {remainingTime && (
          <div className="ban-timer">⏳ {remainingTime}</div>
        )}
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
