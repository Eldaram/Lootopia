import db from "../../../services/db";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === "GET") {
    const hunt = await db("hunts")
      .select("id", "title", "duration")
      .where({ id })
      .first();

    if (!hunt) {
      return res.status(404).json({ error: "Chasse non trouvé" });
    }

    return res.status(200).json(hunt);
  }
}
