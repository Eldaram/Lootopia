import cors from "../../lib/cors.js";
import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les artefacts
const artifactSchema = Yup.object({
  admin_id: Yup.number().required(
    "L'identifiant de l'administrateur est requis"
  ),
  type: Yup.number().nullable().default(null),
  theme_id: Yup.number().nullable().default(null),
  rarity: Yup.number().nullable().default(null),
  illustration_id: Yup.number().nullable().default(null),
  collection_id: Yup.number().nullable().default(null),
  usage: Yup.number().nullable().default(null),
  status: Yup.number().default(1),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data, isUpdate = false) {
  try {
    // Valider et appliquer les valeurs par défaut
    const validatedData = await artifactSchema.validate(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    // Ajouter le created_at si c'est une nouvelle entrée
    if (!isUpdate) {
      validatedData.created_at = new Date();
    }

    // S'assurer que l'ID n'est pas défini pour les nouvelles entrées
    if (!isUpdate && validatedData.id) {
      delete validatedData.id;
    }

    return validatedData;
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  await cors(req, res);

  // Réponse rapide aux requêtes OPTIONS (pré-vol)
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // Méthode GET : Récupère tous les artefacts ou un artefact spécifique
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        // Récupérer un artefact spécifique par ID
        const artifact = await db("artifacts").where("id", id).first();

        if (!artifact) {
          return res.status(404).json({ error: "Artefact introuvable" });
        }

        return res.status(200).json(artifact);
      } else {
        // Récupérer tous les artefacts
        const artifacts = await db("artifacts");
        return res.status(200).json(artifacts);
      }
    }

    // Méthode POST : Ajoute un nouvel artefact
    if (req.method === "POST") {
      // Vérifier si l'admin_id existe dans la table users
      const adminExists = await db("users")
        .where("id", req.body.admin_id)
        .first();
      if (!adminExists) {
        return res
          .status(404)
          .json({ error: "L'administrateur spécifié n'existe pas" });
      }

      // Vérifier si theme_id existe (si fourni)
      if (req.body.theme_id) {
        const themeExists = await db("themes")
          .where("id", req.body.theme_id)
          .first();
        if (!themeExists) {
          return res
            .status(404)
            .json({ error: "Le thème spécifié n'existe pas" });
        }
      }

      // Vérifier si collection_id existe (si fourni)
      if (req.body.collection_id) {
        const collectionExists = await db("collections")
          .where("id", req.body.collection_id)
          .first();
        if (!collectionExists) {
          return res
            .status(404)
            .json({ error: "La collection spécifiée n'existe pas" });
        }
      }

      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(req.body, false);

      try {
        // Insérer dans la base de données et récupérer l'entrée complète
        const [newArtifact] = await db("artifacts")
          .insert(validatedData)
          .returning([
            "id",
            "type",
            "theme_id",
            "rarity",
            "illustration_id",
            "collection_id",
            "usage",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newArtifact);
      } catch (error) {
        // Gérer explicitement l'erreur de clé dupliquée
        if (
          error.message.includes("artifacts_pkey") ||
          error.message.includes("duplicate key")
        ) {
          console.error("Erreur de clé dupliquée:", error);
          return res.status(409).json({
            error: "Conflit d'ID - impossible de créer l'artefact",
          });
        }
        // Gérer les erreurs de clé étrangère
        if (error.message.includes("foreign key constraint")) {
          console.error("Erreur de clé étrangère:", error);
          return res.status(409).json({
            error:
              "Erreur de référence - une des références (theme_id, collection_id, admin_id) n'existe pas",
          });
        }
        throw error;
      }
    }

    // Méthode PUT : Met à jour un artefact existant
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingArtifact = await db("artifacts").where("id", id).first();
      if (!existingArtifact) {
        return res.status(404).json({ error: "Artefact introuvable" });
      }

      // Vérifier si le nouvel admin_id existe (si fourni)
      if (
        req.body.admin_id &&
        req.body.admin_id !== existingArtifact.admin_id
      ) {
        const adminExists = await db("users")
          .where("id", req.body.admin_id)
          .first();
        if (!adminExists) {
          return res
            .status(404)
            .json({ error: "L'administrateur spécifié n'existe pas" });
        }
      }

      // Vérifier si le nouveau theme_id existe (si fourni)
      if (
        req.body.theme_id &&
        req.body.theme_id !== existingArtifact.theme_id
      ) {
        const themeExists = await db("themes")
          .where("id", req.body.theme_id)
          .first();
        if (!themeExists) {
          return res
            .status(404)
            .json({ error: "Le thème spécifié n'existe pas" });
        }
      }

      // Vérifier si le nouveau collection_id existe (si fourni)
      if (
        req.body.collection_id &&
        req.body.collection_id !== existingArtifact.collection_id
      ) {
        const collectionExists = await db("collections")
          .where("id", req.body.collection_id)
          .first();
        if (!collectionExists) {
          return res
            .status(404)
            .json({ error: "La collection spécifiée n'existe pas" });
        }
      }

      // Fusionner les données existantes avec les nouvelles données
      const mergedData = { ...existingArtifact, ...req.body };

      // Valider et appliquer les valeurs par défaut (indiquer que c'est une mise à jour)
      const validatedData = await validateAndApplyDefaults(mergedData, true);

      // Ajouter updated_at
      validatedData.updated_at = new Date();

      try {
        // Mettre à jour et récupérer l'entrée complète
        const [updatedArtifact] = await db("artifacts")
          .where("id", id)
          .update(validatedData)
          .returning([
            "id",
            "type",
            "theme_id",
            "rarity",
            "illustration_id",
            "collection_id",
            "usage",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedArtifact);
      } catch (error) {
        // Gérer les erreurs de clé étrangère
        if (error.message.includes("foreign key constraint")) {
          console.error("Erreur de clé étrangère:", error);
          return res.status(409).json({
            error:
              "Erreur de référence - une des références (theme_id, collection_id, admin_id) n'existe pas",
          });
        }
        throw error;
      }
    }

    // Méthode DELETE : Supprime un artefact par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si l'artefact existe
      const artifactExists = await db("artifacts").where("id", id).first();
      if (!artifactExists) {
        return res.status(404).json({ error: "Artefact introuvable" });
      }

      // Supprimer l'artefact et retourner les données supprimées
      const [deletedArtifact] = await db("artifacts")
        .where("id", id)
        .del()
        .returning([
          "id",
          "type",
          "theme_id",
          "rarity",
          "illustration_id",
          "collection_id",
          "usage",
          "admin_id",
          "status",
          "created_at",
          "updated_at",
        ]);

      return res.status(200).json(deletedArtifact);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
