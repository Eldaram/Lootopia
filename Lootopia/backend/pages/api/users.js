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
        "created_at"
      );
      return res.status(200).json(users);
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { status, role } = req.body;

      const updated = await db("users").where({ id }).update({ status, role });

      if (updated) {
        return res.status(200).json({ message: "User mis à jour avec succès" });
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
