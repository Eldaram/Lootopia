import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les offres
const offerSchema = Yup.object({
  type: Yup.number().nullable().default(null),
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().nullable().default(null),
  admin_id: Yup.number().required("L'identifiant de l'administrateur est requis"),
  status: Yup.number().default(1),
  lifetime: Yup.string().nullable().default(null)
});

// Validation des données
async function validateData(data) {
  try {
    return await offerSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les offres ou une offre spécifique
    if (req.method === "GET") {
      const { id } = req.query;
      
      if (id) {
        const offer = await db("offers").where("id", id).first();
        if (!offer) {
          return res.status(404).json({ error: "Offre introuvable" });
        }
        return res.status(200).json(offer);
      } else {
        const offers = await db("offers");
        return res.status(200).json(offers);
      }
    }

    // Méthode POST : Ajoute une nouvelle offre
    if (req.method === "POST") {
      // Vérifier si admin_id existe
      const adminExists = await db("users").where("id", req.body.admin_id).first();
      if (!adminExists) {
        return res.status(404).json({ error: "L'administrateur spécifié n'existe pas" });
      }
      
      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();
      
      try {
        // Insérer dans la base de données
        const [newOffer] = await db("offers")
          .insert(validatedData)
          .returning([
            "id",
            "type",
            "title",
            "description",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime"
          ]);
        
        return res.status(201).json(newOffer);
      } catch (error) {
        console.error("Erreur d'insertion:", error);
        
        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'administrateur spécifié n'existe pas"
          });
        }
        
        return res.status(500).json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode PUT : Met à jour une offre existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingOffer = await db("offers").where("id", id).first();
      if (!existingOffer) {
        return res.status(404).json({ error: "Offre introuvable" });
      }
      
      // Vérifier si admin_id existe (si fourni)
      if (req.body.admin_id && req.body.admin_id !== existingOffer.admin_id) {
        const adminExists = await db("users").where("id", req.body.admin_id).first();
        if (!adminExists) {
          return res.status(404).json({ error: "L'administrateur spécifié n'existe pas" });
        }
      }
      
      // Préparer les données à mettre à jour
      const dataToUpdate = {
        ...req.body,
        updated_at: new Date()
      };
      
      try {
        // Mettre à jour l'offre
        const [updatedOffer] = await db("offers")
          .where("id", id)
          .update(dataToUpdate)
          .returning([
            "id",
            "type",
            "title",
            "description",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime"
          ]);
        
        return res.status(200).json(updatedOffer);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);
        
        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'administrateur spécifié n'existe pas"
          });
        }
        
        return res.status(500).json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une offre par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si l'offre existe
      const offerExists = await db("offers").where("id", id).first();
      if (!offerExists) {
        return res.status(404).json({ error: "Offre introuvable" });
      }
      
      // Vérifier si l'offre est utilisée par des utilisateurs
      const offerInUse = await db("user_offers").where("offer_id", id).first();
      if (offerInUse) {
        return res.status(409).json({
          error: "Cette offre est utilisée par des utilisateurs et ne peut pas être supprimée"
        });
      }

      try {
        // Supprimer l'offre
        const [deletedOffer] = await db("offers")
          .where("id", id)
          .del()
          .returning([
            "id",
            "type",
            "title",
            "description",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime"
          ]);
        
        return res.status(200).json(deletedOffer);
      } catch (error) {
        console.error("Erreur de suppression:", error);
        return res.status(500).json({ error: `Erreur lors de la suppression: ${error.message}` });
      }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}