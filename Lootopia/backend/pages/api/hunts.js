import db from "../../services/db.js";
import * as Yup from "yup";

const huntSchema = Yup.object({
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().default(""),
  world: Yup.number().default(1),
  duration: Yup.date().default(
    () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ), // 1 mois
  mode: Yup.number().default(1),
  max_participants: Yup.number().default(10),
  chat_enabled: Yup.boolean().default(true),
  map_id: Yup.number().default(1),
  participation_fee: Yup.number().default(0),
  search_delay: Yup.string().default("00:01:00"), // 1 minute
  partner_id: Yup.number().required("Le créateur est requis"),
  status: Yup.number().default(1),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data) {
  try {
    // Valider et appliquer les valeurs par défaut
    const validatedData = await huntSchema.validate(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    // Ajouter le created_at si c'est une nouvelle entrée
    if (!data.id) {
      validatedData.created_at = new Date();
    }

    return validatedData;
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  try {
    // Méthode GET : Récupère toutes les chasses
    if (req.method === "GET") {
      const hunts = await db("hunts");
      return res.status(200).json(hunts);
    }

    // Méthode POST : Ajoute une nouvelle chasse
    if (req.method === "POST") {
      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(req.body);

      // Insérer dans la base de données et récupérer l'entrée complète
      const [newHunt] = await db("hunts").insert(validatedData).returning("*");

      return res.status(201).json(newHunt);
    }

    // Méthode PUT : Met à jour une chasse existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingHunt = await db("hunts").where("id", id).first();
      if (!existingHunt) {
        return res.status(404).json({ error: "Chasse introuvable" });
      }

      // Fusionner les données existantes avec les nouvelles données
      const mergedData = { ...existingHunt, ...req.body };

      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(mergedData);

      // Ajouter updated_at
      validatedData.updated_at = new Date();

      // Mettre à jour et récupérer l'entrée complète
      const [updatedHunt] = await db("hunts")
        .where("id", id)
        .update(validatedData)
        .returning("*");

      return res.status(200).json(updatedHunt);
    }

    // Méthode DELETE : Supprime une chasse par ID
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

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
