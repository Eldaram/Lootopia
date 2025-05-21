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
      const { status } = req.body;

      if (!id || typeof status === "undefined") {
        return res.status(400).json({ error: "ID et status requis" });
      }

      const updated = await db("users").where({ id }).update({ status });

      if (updated) {
        return res
          .status(200)
          .json({ message: "Status mis à jour avec succès" });
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
