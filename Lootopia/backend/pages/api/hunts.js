// api/hunts.js - Version complètement révisée
import * as Yup from "yup";
import db from "../../services/db.js";

// Schéma Yup pour validation (inchangé)
const huntSchema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().default(""),
  world: Yup.number().default(1),
  duration: Yup.date().default(
    () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ),
  mode: Yup.number().default(1),
  max_participants: Yup.number().default(10),
  chat_enabled: Yup.boolean().default(true),
  map_id: Yup.number().default(1),
  participation_fee: Yup.number().default(0),
  search_delay: Yup.string().default("00:01:00"),
  partner_id: Yup.number().required("Le créateur est requis"),
  status: Yup.number().default(1),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data) {
  try {
    const validatedData = await huntSchema.validate(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    if (!data.id) {
      validatedData.created_at = new Date();
    }

    return validatedData;
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  console.log(`Requête ${req.method} reçue pour ${req.url}`);
  console.log(`En-têtes de la requête:`, req.headers);
  
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // IMPORTANT: Ajout de cet en-tête
  res.setHeader("Access-Control-Max-Age", "86400");

  // Gérer immédiatement les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // MÉTHODES API
    // GET - Récupère toutes les chasses
    if (req.method === "GET") {
      const hunts = await db("hunts");
      return res.status(200).json(hunts);
    }

    // POST - Ajoute une nouvelle chasse
    if (req.method === "POST") {
      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(req.body);

      // Insérer dans la base de données
      const [newHunt] = await db("hunts").insert(validatedData).returning("*");

      return res.status(201).json(newHunt);
    }

    // PUT - Met à jour une chasse existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      const existingHunt = await db("hunts").where("id", id).first();
      if (!existingHunt) {
        return res.status(404).json({ error: "Chasse introuvable" });
      }

      const mergedData = { ...existingHunt, ...req.body };
      const validatedData = await validateAndApplyDefaults(mergedData);
      validatedData.updated_at = new Date();

      const [updatedHunt] = await db("hunts")
        .where("id", id)
        .update(validatedData)
        .returning("*");

      return res.status(200).json(updatedHunt);
    }

    // DELETE - Supprime une chasse par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      const [deletedHunt] = await db("hunts")
        .where("id", id)
        .del()
        .returning("*");

      if (!deletedHunt) {
        return res.status(404).json({ error: "Chasse introuvable" });
      }

      return res.status(200).json(deletedHunt);
    }

    // Méthode non supportée
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    return res
      .status(405)
      .json({ error: `Méthode ${req.method} non autorisée` });
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
