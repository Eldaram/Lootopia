import db from "../../services/db.js";
import * as Yup from "yup";


// Validation
const participantSchema = Yup.object({
  hunt_id: Yup.number().required("hunt_id requis").positive().integer(),
  email: Yup.string().email("Email invalide").nullable(),
  username: Yup.string().min(3).max(50).nullable(),
  excluded: Yup.boolean().default(false),
});

async function findUserByIdentifier(email, username) {
  if (email) {
    return db("users").where({ email }).first();
  }
  if (username) {
    return db("users").where({ username }).first();
  }
  return null;
}

async function handleGet(req, res) {
  const { hunt_id } = req.query;
  if (!hunt_id) return res.status(400).json({ error: "hunt_id requis" });

  const rows = await db("hunts_participants as hp")
    .join("users as u", "hp.user_id", "u.id")
    .where("hp.hunt_id", hunt_id)
    .select(
      "hp.id",
      "u.id as user_id",
      "u.username",
      "u.email",
      "hp.excluded",
      "hp.created_at",
      "hp.updated_at"
    )
    .orderBy("hp.created_at", "desc");

  res.status(200).json(rows);
}

async function handlePost(req, res) {
  try {
    const { hunt_id, email, username } = req.body;
    const validated = await participantSchema.validate({
      hunt_id,
      email,
      username,
    });

    const user = await findUserByIdentifier(
      validated.email,
      validated.username
    );
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const existing = await db("hunts_participants")
      .where({ hunt_id, user_id: user.id })
      .first();

    if (existing) {
      return res.status(409).json({ error: "Participant déjà ajouté" });
    }

    const [id] = await db("hunts_participants")
      .insert({
        hunt_id,
        user_id: user.id,
        excluded: false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("id");

    res.status(201).json({ id });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors.join(", ") });
    }
    console.error("Erreur POST participant:", error);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

async function handlePut(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID du participant requis" });

  const { excluded } = req.body;
  if (typeof excluded !== "boolean") {
    return res.status(400).json({ error: "excluded doit être un booléen" });
  }

  const updated = await db("hunts_participants")
    .where({ id })
    .update({ excluded, updated_at: new Date() });

  if (updated === 0) {
    return res.status(404).json({ error: "Participant introuvable" });
  }

  res.status(200).json({ success: true });
}

async function handleDelete(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID requis pour suppression" });

  const deleted = await db("hunts_participants").where({ id }).del();

  if (deleted === 0) {
    return res.status(404).json({ error: "Participant introuvable" });
  }

  res.status(204).end();
}

// Export API Handler
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
        return res
          .status(405)
          .json({ error: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("[PARTICIPANTS API] Erreur:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", message: error.message });
  }
}
