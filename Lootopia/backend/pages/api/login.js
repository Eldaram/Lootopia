import db from "../../services/db";
import { serialize } from "cookie";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ message: "Méthode non autorisée" });

  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email, password }).first();

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (parseInt(user.status) === 0) {
      return res.status(403).json({ message: "Ce compte est désactivé." });
    }

    const now = new Date();
    if (user.disabled_end && new Date(user.disabled_end) > now) {
      const banEnd = new Date(user.disabled_end).toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      });
      return res
        .status(403)
        .json({ message: `Ce compte est banni jusqu'au ${banEnd}.` });
    }

    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      appearance_id: user.appearance_id,
    };

    const cookie = serialize("session", JSON.stringify(session), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ success: true, user: session });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
