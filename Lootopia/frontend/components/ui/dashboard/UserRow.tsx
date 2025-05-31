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
    if (!user.disabled_start || !user.disabled_end) return;
  
    const start = new Date(user.disabled_start).getTime();
    const end = new Date(user.disabled_end).getTime();
    const now = Date.now();
  
    console.log("BAN CHECK", {
      start: new Date(user.disabled_start),
      end: new Date(user.disabled_end),
      now: new Date(now),
    });
  
    if (isNaN(start) || isNaN(end)) return; // invalid dates
    if (now < start || now >= end) return;
  
    const updateRemainingTime = () => {
      const now = Date.now();
      const diff = end - now;
  
      if (diff <= 0) {
        setRemainingTime("");
        clearInterval(interval);
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
    const interval = setInterval(updateRemainingTime, 1000);
  
    return () => clearInterval(interval);
  }, [user.disabled_start, user.disabled_end]);   

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
