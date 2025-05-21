import { useEffect, useState } from "react";
import { getSession } from "../../services/authService";
import "../../../src/styles.css";
import { ToggleSwitch } from "@/components/ui/dashboard/ToggleSwitch";

export const DashboardScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

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
        const res = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      }
    };

    fetchSession();
  }, []);

  if (!user) return <p>Chargement...</p>;

  if (user.role !== "admin") {
    return <p className="denied">Vous n'avez pas l'autorisation d'accéder à cette page</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gestion des utilisateurs</h1>

      <div className="dashboard-table-container">
        <div className="dashboard-table-header">
          <strong className="dashboard-header-cell">Action</strong>
          <strong className="dashboard-header-cell">Nom</strong>
          <strong className="dashboard-header-cell">Email</strong>
          <strong className="dashboard-header-cell">Rôle</strong>
        </div>

        {Array.isArray(users) && users.length > 0 ? (
          users.map((u, index) => (
            <div key={index} className="dashboard-table-row">
              <span className="dashboard-cell">
                <ToggleSwitch
                  checked={u.status === 1}
                  onChange={() => handleToggleStatus(u.id, u.status)}
                />
              </span>
              <span className="dashboard-cell">{u.username}</span>
              <span className="dashboard-cell">{u.email}</span>
              <span className="dashboard-cell">
                <select
                  value={u.role}
                  onChange={(e) => handleChangeRole(u.id, e.target.value)}
                  className="role-select"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="moderator">Modérateur</option>
                  <option value="organizer">Organisateur</option>
                </select>
              </span>
            </div>
          ))
        ) : (
          <div className="dashboard-table-row">
            <span className="dashboard-cell">Aucun utilisateur trouvé.</span>
          </div>
        )}
      </div>
    </div>
  );
};
