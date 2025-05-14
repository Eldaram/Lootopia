import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les associations chasse-artefact
const huntArtifactSchema = Yup.object({
  hunt_id: Yup.number().required("L'identifiant de la chasse est requis"),
  artifact_id: Yup.number().required("L'identifiant de l'artefact est requis"),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data, isUpdate = false) {
  try {
    // Valider et appliquer les valeurs par défaut
    const validatedData = await huntArtifactSchema.validate(data, {
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
  try {
    // Méthode GET : Récupère toutes les associations ou une association spécifique
    if (req.method === "GET") {
      const { id, hunt_id, artifact_id } = req.query;

      if (id) {
        // Récupérer une association spécifique par ID
        const huntArtifact = await db("hunt_artifacts").where("id", id).first();

        if (!huntArtifact) {
          return res
            .status(404)
            .json({ error: "Association chasse-artefact introuvable" });
        }

        return res.status(200).json(huntArtifact);
      } else if (hunt_id) {
        // Récupérer tous les artefacts d'une chasse spécifique
        const huntArtifacts = await db("hunt_artifacts").where(
          "hunt_id",
          hunt_id
        );
        return res.status(200).json(huntArtifacts);
      } else if (artifact_id) {
        // Récupérer toutes les chasses associées à un artefact spécifique
        const huntArtifacts = await db("hunt_artifacts").where(
          "artifact_id",
          artifact_id
        );
        return res.status(200).json(huntArtifacts);
      } else {
        // Récupérer toutes les associations
        const huntArtifacts = await db("hunt_artifacts");
        return res.status(200).json(huntArtifacts);
      }
    }

    // Méthode POST : Ajoute une nouvelle association
    if (req.method === "POST") {
      // Vérifier si la chasse existe
      const huntExists = await db("hunts")
        .where("id", req.body.hunt_id)
        .first();
      if (!huntExists) {
        return res
          .status(404)
          .json({ error: "La chasse spécifiée n'existe pas" });
      }

      // Vérifier si l'artefact existe
      const artifactExists = await db("artifacts")
        .where("id", req.body.artifact_id)
        .first();
      if (!artifactExists) {
        return res
          .status(404)
          .json({ error: "L'artefact spécifié n'existe pas" });
      }

      // Vérifier si l'association existe déjà
      const existingAssociation = await db("hunt_artifacts")
        .where({
          hunt_id: req.body.hunt_id,
          artifact_id: req.body.artifact_id,
        })
        .first();

      if (existingAssociation) {
        return res.status(409).json({
          error: "Cette association chasse-artefact existe déjà",
          association: existingAssociation,
        });
      }

      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(req.body, false);

      try {
        // Insérer dans la base de données et récupérer l'entrée complète
        const [newHuntArtifact] = await db("hunt_artifacts")
          .insert(validatedData)
          .returning([
            "id",
            "hunt_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newHuntArtifact);
      } catch (error) {
        // Gérer explicitement l'erreur de clé dupliquée
        if (
          error.message.includes("hunt_artifacts_pkey") ||
          error.message.includes("duplicate key")
        ) {
          console.error("Erreur de clé dupliquée:", error);
          return res.status(409).json({
            error: "Conflit d'ID - impossible de créer l'association",
          });
        }
        // Gérer les erreurs de clé étrangère
        if (error.message.includes("foreign key constraint")) {
          console.error("Erreur de clé étrangère:", error);
          return res.status(409).json({
            error: "Erreur de référence - la chasse ou l'artefact n'existe pas",
          });
        }
        throw error;
      }
    }

    // Méthode PUT : Met à jour une association existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingHuntArtifact = await db("hunt_artifacts")
        .where("id", id)
        .first();
      if (!existingHuntArtifact) {
        return res
          .status(404)
          .json({ error: "Association chasse-artefact introuvable" });
      }

      // Vérifier si la nouvelle chasse existe (si fournie)
      if (
        req.body.hunt_id &&
        req.body.hunt_id !== existingHuntArtifact.hunt_id
      ) {
        const huntExists = await db("hunts")
          .where("id", req.body.hunt_id)
          .first();
        if (!huntExists) {
          return res
            .status(404)
            .json({ error: "La chasse spécifiée n'existe pas" });
        }
      }

      // Vérifier si le nouvel artefact existe (si fourni)
      if (
        req.body.artifact_id &&
        req.body.artifact_id !== existingHuntArtifact.artifact_id
      ) {
        const artifactExists = await db("artifacts")
          .where("id", req.body.artifact_id)
          .first();
        if (!artifactExists) {
          return res
            .status(404)
            .json({ error: "L'artefact spécifié n'existe pas" });
        }
      }

      // Vérifier si la nouvelle association existe déjà
      if (req.body.hunt_id && req.body.artifact_id) {
        const duplicateAssociation = await db("hunt_artifacts")
          .where({
            hunt_id: req.body.hunt_id,
            artifact_id: req.body.artifact_id,
          })
          .whereNot("id", id)
          .first();

        if (duplicateAssociation) {
          return res.status(409).json({
            error:
              "Cette association chasse-artefact existe déjà avec un autre ID",
          });
        }
      }

      // Fusionner les données existantes avec les nouvelles données
      const mergedData = { ...existingHuntArtifact, ...req.body };

      // Valider et appliquer les valeurs par défaut (indiquer que c'est une mise à jour)
      const validatedData = await validateAndApplyDefaults(mergedData, true);

      // Ajouter updated_at
      validatedData.updated_at = new Date();

      try {
        // Mettre à jour et récupérer l'entrée complète
        const [updatedHuntArtifact] = await db("hunt_artifacts")
          .where("id", id)
          .update(validatedData)
          .returning([
            "id",
            "hunt_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedHuntArtifact);
      } catch (error) {
        // Gérer les erreurs de clé étrangère
        if (error.message.includes("foreign key constraint")) {
          console.error("Erreur de clé étrangère:", error);
          return res.status(409).json({
            error: "Erreur de référence - la chasse ou l'artefact n'existe pas",
          });
        }
        throw error;
      }
    }

    // Méthode DELETE : Supprime une association par ID ou par paire hunt_id/artifact_id
    if (req.method === "DELETE") {
      const { id, hunt_id, artifact_id } = req.query;

      if (id) {
        // Vérifier si l'association existe
        const huntArtifactExists = await db("hunt_artifacts")
          .where("id", id)
          .first();
        if (!huntArtifactExists) {
          return res
            .status(404)
            .json({ error: "Association chasse-artefact introuvable" });
        }

        // Supprimer l'association et retourner les données supprimées
        const [deletedHuntArtifact] = await db("hunt_artifacts")
          .where("id", id)
          .del()
          .returning([
            "id",
            "hunt_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedHuntArtifact);
      } else if (hunt_id && artifact_id) {
        // Vérifier si l'association existe
        const huntArtifactExists = await db("hunt_artifacts")
          .where({
            hunt_id: hunt_id,
            artifact_id: artifact_id,
          })
          .first();

        if (!huntArtifactExists) {
          return res
            .status(404)
            .json({ error: "Association chasse-artefact introuvable" });
        }

        // Supprimer l'association et retourner les données supprimées
        const [deletedHuntArtifact] = await db("hunt_artifacts")
          .where({
            hunt_id: hunt_id,
            artifact_id: artifact_id,
          })
          .del()
          .returning([
            "id",
            "hunt_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedHuntArtifact);
      } else {
        return res
          .status(400)
          .json({
            error: "ID ou paire hunt_id/artifact_id requis pour la suppression",
          });
      }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
