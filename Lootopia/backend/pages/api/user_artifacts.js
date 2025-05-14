import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les associations utilisateur-artefact
const userArtifactSchema = Yup.object({
  user_id: Yup.number().required("L'identifiant de l'utilisateur est requis"),
  artifact_id: Yup.number().required("L'identifiant de l'artefact est requis"),
});

// Validation des données
async function validateData(data) {
  try {
    return await userArtifactSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les associations ou une association spécifique
    if (req.method === "GET") {
      const { id, user_id, artifact_id } = req.query;

      if (id) {
        // Récupérer une association spécifique par ID
        const userArtifact = await db("user_artifacts").where("id", id).first();
        if (!userArtifact) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-artefact introuvable" });
        }
        return res.status(200).json(userArtifact);
      } else if (user_id) {
        // Récupérer tous les artefacts d'un utilisateur spécifique
        const userArtifacts = await db("user_artifacts")
          .select([
            "user_artifacts.*",
            "artifacts.type",
            "artifacts.rarity",
            "artifacts.collection_id",
          ])
          .join("artifacts", "user_artifacts.artifact_id", "=", "artifacts.id")
          .where("user_artifacts.user_id", user_id);
        return res.status(200).json(userArtifacts);
      } else if (artifact_id) {
        // Récupérer tous les utilisateurs qui possèdent un artefact spécifique
        const userArtifacts = await db("user_artifacts")
          .select(["user_artifacts.*", "users.username", "users.email"])
          .join("users", "user_artifacts.user_id", "=", "users.id")
          .where("user_artifacts.artifact_id", artifact_id);
        return res.status(200).json(userArtifacts);
      } else {
        // Récupérer toutes les associations
        const userArtifacts = await db("user_artifacts");
        return res.status(200).json(userArtifacts);
      }
    }

    // Méthode POST : Ajoute une nouvelle association
    if (req.method === "POST") {
      // Vérifier si l'utilisateur existe
      const userExists = await db("users")
        .where("id", req.body.user_id)
        .first();
      if (!userExists) {
        return res
          .status(404)
          .json({ error: "L'utilisateur spécifié n'existe pas" });
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
      const existingAssociation = await db("user_artifacts")
        .where({
          user_id: req.body.user_id,
          artifact_id: req.body.artifact_id,
        })
        .first();

      if (existingAssociation) {
        return res.status(409).json({
          error: "Cet utilisateur possède déjà cet artefact",
          association: existingAssociation,
        });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newUserArtifact] = await db("user_artifacts")
          .insert(validatedData)
          .returning([
            "id",
            "user_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newUserArtifact);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'utilisateur ou l'artefact spécifié n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode PUT : Met à jour une association existante (pour updated_at)
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingUserArtifact = await db("user_artifacts")
        .where("id", id)
        .first();
      if (!existingUserArtifact) {
        return res
          .status(404)
          .json({ error: "Association utilisateur-artefact introuvable" });
      }

      // Mettre à jour updated_at
      try {
        const [updatedUserArtifact] = await db("user_artifacts")
          .where("id", id)
          .update({ updated_at: new Date() })
          .returning([
            "id",
            "user_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedUserArtifact);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);
        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une association par ID ou par paire user_id/artifact_id
    if (req.method === "DELETE") {
      const { id, user_id, artifact_id } = req.query;

      if (id) {
        // Vérifier si l'association existe
        const userArtifactExists = await db("user_artifacts")
          .where("id", id)
          .first();
        if (!userArtifactExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-artefact introuvable" });
        }

        // Supprimer l'association
        const [deletedUserArtifact] = await db("user_artifacts")
          .where("id", id)
          .del()
          .returning([
            "id",
            "user_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedUserArtifact);
      } else if (user_id && artifact_id) {
        // Vérifier si l'association existe
        const userArtifactExists = await db("user_artifacts")
          .where({
            user_id: user_id,
            artifact_id: artifact_id,
          })
          .first();

        if (!userArtifactExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-artefact introuvable" });
        }

        // Supprimer l'association
        const [deletedUserArtifact] = await db("user_artifacts")
          .where({
            user_id: user_id,
            artifact_id: artifact_id,
          })
          .del()
          .returning([
            "id",
            "user_id",
            "artifact_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedUserArtifact);
      } else {
        return res
          .status(400)
          .json({
            error: "ID ou paire user_id/artifact_id requis pour la suppression",
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
