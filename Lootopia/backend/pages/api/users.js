import db from "../../services/db";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const users = await db("users").select(
        "id",
        "username",
        "email",
        "role",
        "status",
        "created_at",
        "updated_at",
        "disabled_time",
        "disabled_start"
      );
      return res.status(200).json(users);
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { status, role, disabled_time, disabled_start } = req.body;

      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (role !== undefined) updateData.role = role;
      if (disabled_time !== undefined) {
        const hours = Math.floor(disabled_time / 60);
        const minutes = disabled_time % 60;
        updateData.disabled_time = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:00`;
      }
      if (disabled_start !== undefined) {
        updateData.disabled_start = new Date(disabled_start);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
      }

      const updated = await db("users").where({ id }).update(updateData);

      if (updated) {
        return res
          .status(200)
          .json({ message: "Utilisateur mis à jour avec succès" });
      } else {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}
