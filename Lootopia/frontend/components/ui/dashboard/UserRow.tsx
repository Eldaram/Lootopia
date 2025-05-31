import { useEffect, useState } from "react";
import { ToggleSwitch } from "@/components/ui/dashboard/ToggleSwitch";

interface UserRowProps {
  user: any;
  onToggleStatus: (userId: number, currentStatus: number) => void;
  onChangeRole: (userId: number, newRole: string) => void;
  onBanClick: (userId: number) => void;
  onUnbanSuccess: (userId: number) => void;
}

export const UserRow = ({ user, onToggleStatus, onChangeRole, onBanClick, onUnbanSuccess }: UserRowProps) => {
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
    <div className="dashboard-table-row">
      <span className="dashboard-cell">
        <ToggleSwitch
          checked={user.status === 1}
          onChange={() => onToggleStatus(user.id, user.status)}
        />

        {!remainingTime ? (
          <button className="ban-button" onClick={() => onBanClick(user.id)}>
            Bannir
          </button>
        ) : (
          <span className="ban-info">
            <span className="ban-timer">⏳ {remainingTime}</span>
            <button className="unban-button" onClick={handleUnbanClick}>
              Débannir
            </button>
          </span>
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
