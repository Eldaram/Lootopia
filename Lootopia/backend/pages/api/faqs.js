// api/faqs.js
import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour FAQ
const faqSchema = Yup.object({
  question: Yup.string().required().min(5).max(255),
  answer: Yup.string().required().min(5),
  is_active: Yup.boolean().default(true),
});

const faqUpdateSchema = Yup.object({
  question: Yup.string().min(5).max(255),
  answer: Yup.string().min(5),
  is_active: Yup.boolean(),
});

async function validateFaq(data, isUpdate = false) {
  const schema = isUpdate ? faqUpdateSchema : faqSchema;
  const validated = await schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  validated.updated_at = new Date();
  if (!isUpdate) validated.created_at = new Date();
  return validated;
}

// GET /api/faqs
async function handleGet(req, res) {
  const faqs = await db("faq_entries")
    .where({ is_active: true })
    .orderBy("id", "asc");
  res.status(200).json(faqs);
}

// POST /api/faqs
async function handlePost(req, res) {
  const validated = await validateFaq(req.body);
  const [faq] = await db("faq_entries").insert(validated).returning("*");
  res.status(201).json(faq);
}

// PUT /api/faqs?id=xx
async function handlePut(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID requis" });

  const validated = await validateFaq(req.body, true);
  await db("faq_entries").where({ id }).update(validated);
  const updated = await db("faq_entries").where({ id }).first();
  res.status(200).json(updated);
}

// DELETE /api/faqs?id=xx
async function handleDelete(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID requis" });

  const deleted = await db("faq_entries").where({ id }).del();
  if (!deleted)
    return res.status(404).json({ error: "Entrée FAQ non trouvée" });

  res.status(204).end();
}

// Main handler
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
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("[FAQ API] Error:", error);
    return res
      .status(500)
      .json({ error: "Erreur interne serveur", message: error.message });
  }
}
