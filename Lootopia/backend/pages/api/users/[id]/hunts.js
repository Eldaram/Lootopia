import db from "../../../../services/db";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
}
