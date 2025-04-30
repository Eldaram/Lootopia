import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation commun pour la chasse
const huntSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string().optional(),
  date: Yup.date().required("La date est requise"),
});

// Validation des données
async function validateData(data) {
  try {
    await huntSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les chasses
    if (req.method === "GET") {
      const hunts = await db("hunts");
      return res.status(200).json(hunts);
    }

    // Méthode POST : Ajoute une nouvelle chasse
    if (req.method === "POST") {
      await validateData(req.body); // Validation avant insertion

      const [id] = await db("hunts").insert(req.body).returning("id");
      return res.status(201).json({ id });
    }

    // Méthode PUT : Met à jour une chasse existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      await validateData(req.body); // Validation avant mise à jour

      const [updatedHunt] = await db("hunts")
        .where("id", id)
        .update(req.body)
        .returning("*");

      if (!updatedHunt) {
        return res.status(404).json({ error: "Chasse introuvable" });
      }

      return res.status(200).json(updatedHunt);
    }

    // Méthode DELETE : Supprime une chasse par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      const deletedHunt = await db("hunts")
        .where("id", id)
        .del()
        .returning("*");

      if (!deletedHunt.length) {
        return res.status(404).json({ error: "Chasse introuvable" });
      }

      return res.status(200).json({ message: "Chasse supprimée" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
