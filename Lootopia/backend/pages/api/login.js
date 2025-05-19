import db from "../../services/db";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email, password }).first();

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const cookie = serialize("session", JSON.stringify(session), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 jour de connexion
    });

    res.setHeader("Set-Cookie", cookie);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json({ success: true, user: session });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
