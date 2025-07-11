// api/helps.js
import db from "../../services/db.js";
import * as Yup from "yup";

// Validation pour création
const helpRequestSchema = Yup.object({
  user_id: Yup.number().integer().nullable(),
  email: Yup.string().email().nullable(),
  subject: Yup.string().required().min(5).max(255),
  message: Yup.string().required().min(10).max(2000),
});

// Validation pour réponse admin
const helpResponseSchema = Yup.object({
  response: Yup.string().required().min(3),
  responded_by: Yup.number().required(),
});

async function handlePost(req, res) {
  const validated = await helpRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  validated.created_at = new Date();
  validated.updated_at = new Date();

  const [inserted] = await db("help_requests").insert(validated).returning("*");
  res.status(201).json(inserted);
}

async function handleGet(req, res) {
  // TODO : vérifier req.user.isAdmin si applicable
  const results = await db("help_requests").orderBy("created_at", "desc");
  res.status(200).json(results);
}

async function handlePut(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID requis" });

  const validated = await helpResponseSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  await db("help_requests").where({ id }).update({
    response: validated.response,
    responded_by: validated.responded_by,
    is_resolved: true,
    updated_at: new Date(),
  });

  const updated = await db("help_requests").where({ id }).first();
  res.status(200).json(updated);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  try {
    switch (req.method) {
      case "POST":
        return await handlePost(req, res);
      case "GET":
        return await handleGet(req, res);
      case "PUT":
        return await handlePut(req, res);
      default:
        res.setHeader("Allow", ["POST", "GET", "PUT"]);
        return res
          .status(405)
          .json({ error: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("[HELP API] Error:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", message: error.message });
  }
}
