import db from "../../../../services/db";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const { id } = req.query;
    const userId = parseInt(id, 10);

    try {
      const hunts = await db("user_hunts")
        .join("hunts", "user_hunts.hunt_id", "hunts.id")
        .where("user_hunts.user_id", userId)
        .select(
          "hunts.id",
          "hunts.title",
          "hunts.description",
          "hunts.duration",
          "hunts.max_participants",
          "hunts.chat_enabled",
          "hunts.search_delay",
          "hunts.participation_fee as gain"
        );

      res.status(200).json(hunts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
    return;
  }

  if (req.method === "POST") {
    const { user_id, hunt_id } = req.body;

    try {
      await db("user_hunts").insert({
        user_id,
        hunt_id,
      });

      res
        .status(200)
        .json({ message: "Participation enregistrée avec succès" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Erreur lors de l'insertion dans user_hunts" });
    }
  }

  return res.status(405).json({ error: `Méthode ${method} non autorisée` });
}
