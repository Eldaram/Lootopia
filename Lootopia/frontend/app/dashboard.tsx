import { useEffect, useState } from "react";
import { getSession } from "./src/services/authService";
import './src/styles.css';
import { UserRow } from "@/components/ui/dashboard/UserRow";
import { BanUserModal } from "@/components/ui/dashboard/BanUserModal";

export const DashboardScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [banModalUserId, setBanModalUserId] = useState<number | null>(null);
  const [banEndDate, setBanEndDate] = useState<string>("");

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
        if (!res.ok) {
          throw new Error("Erreur de récupération des utilisateurs");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalizedUsers = data.map((u) => ({
            ...u,
            disabled_start: u.disabled_start ? new Date(u.disabled_start).toISOString() : null,
            disabled_end: u.disabled_end ? new Date(u.disabled_end).toISOString() : null,
          }));
          setUsers(normalizedUsers);
        }        
      }
    };
    fetchSession();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || u.status === (filterStatus === "active" ? 0: 1);
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleBanUser = async () => {
    if (!banModalUserId || !banEndDate) return;
  
    const now = new Date().toISOString();
      const res = await fetch(`http://localhost:3000/api/users?id=${banModalUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disabled_start: now,
          disabled_end: banEndDate,
        }),
      });
  
      if (!res.ok) throw new Error("Erreur lors du bannissement");
  
      const updatedUsers = users.map(user =>
        user.id === banModalUserId
          ? { ...user, disabled_start: now, disabled_end: banEndDate }
          : user
      );
  
      setUsers(updatedUsers);
      setBanModalUserId(null);
      setBanEndDate("");
  };  

  if (!user) return <p>Chargement...</p>;

  if (user.role !== "admin") {
    return <p className="denied">Vous n'avez pas l'autorisation d'accéder à cette page</p>;
  }

  const handleUnbanSuccess = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, disabled_start: null, disabled_end: null } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gestion des utilisateurs</h1>
      <div className="dashboard-filters">
        <input
          type="text"
          placeholder="Rechercher par nom ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Modérateur</option>
          <option value="organizer">Organisateur</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div className="dashboard-table-container">
        <div className="dashboard-table-header">
          <strong className="dashboard-header-cell">Action</strong>
          <strong className="dashboard-header-cell">Nom</strong>
          <strong className="dashboard-header-cell">Email</strong>
          <strong className="dashboard-header-cell">Rôle</strong>
        </div>

        {filteredUsers.length > 0 ? (
          <>
            {filteredUsers.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                onToggleStatus={handleToggleStatus}
                onChangeRole={handleChangeRole}
                onBanClick={setBanModalUserId}
                onUnbanSuccess={handleUnbanSuccess}
              />
            ))}

            <BanUserModal
              isOpen={banModalUserId !== null}
              endDate={banEndDate}
              onEndDateChange={setBanEndDate}
              onCancel={() => {
                setBanModalUserId(null);
                setBanEndDate("");
              }}
              onConfirm={handleBanUser}
            />

          </>
        ) : (
          <div className="dashboard-table-row">
            <span className="dashboard-cell">Aucun utilisateur trouvé.</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardScreen;
