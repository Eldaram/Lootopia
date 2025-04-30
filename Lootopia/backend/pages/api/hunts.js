import db from "../../services/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const hunts = await db("hunts");
      return res.status(200).json(hunts);
    }

    if (req.method === "POST") {
      const [id] = await db("hunts").insert(req.body).returning("id");
      return res.status(201).json({ id });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
