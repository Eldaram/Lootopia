import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les badges
const badgeSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  type: Yup.number().nullable().default(null),
  illustration_id: Yup.number().nullable().default(null),
  collections_id: Yup.number().nullable().default(null),
  admin_id: Yup.number().required(
    "L'identifiant de l'administrateur est requis"
  ),
  status: Yup.number().default(1),
});

// Validation des données
async function validateData(data) {
  try {
    return await badgeSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère tous les badges ou un badge spécifique
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const badge = await db("badges").where("id", id).first();
        if (!badge) {
          return res.status(404).json({ error: "Badge introuvable" });
        }
        return res.status(200).json(badge);
      } else {
        const badges = await db("badges");
        return res.status(200).json(badges);
      }
    }

    // Méthode POST : Ajoute un nouveau badge
    if (req.method === "POST") {
      // Vérifier si l'admin_id existe
      const adminExists = await db("users")
        .where("id", req.body.admin_id)
        .first();
      if (!adminExists) {
        return res
          .status(404)
          .json({ error: "L'administrateur spécifié n'existe pas" });
      }

      // Vérifier si collections_id existe (si fourni)
      if (req.body.collections_id) {
        const collectionExists = await db("collections")
          .where("id", req.body.collections_id)
          .first();
        if (!collectionExists) {
          return res
            .status(404)
            .json({ error: "La collection spécifiée n'existe pas" });
        }
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newBadge] = await db("badges")
          .insert(validatedData)
          .returning([
            "id",
            "name",
            "type",
            "illustration_id",
            "collections_id",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newBadge);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Une des références (admin_id, collections_id) n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode PUT : Met à jour un badge existant
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingBadge = await db("badges").where("id", id).first();
      if (!existingBadge) {
        return res.status(404).json({ error: "Badge introuvable" });
      }

      // Vérifier si admin_id existe (si fourni)
      if (req.body.admin_id && req.body.admin_id !== existingBadge.admin_id) {
        const adminExists = await db("users")
          .where("id", req.body.admin_id)
          .first();
        if (!adminExists) {
          return res
            .status(404)
            .json({ error: "L'administrateur spécifié n'existe pas" });
        }
      }

      // Vérifier si collections_id existe (si fourni)
      if (
        req.body.collections_id &&
        req.body.collections_id !== existingBadge.collections_id
      ) {
        const collectionExists = await db("collections")
          .where("id", req.body.collections_id)
          .first();
        if (!collectionExists) {
          return res
            .status(404)
            .json({ error: "La collection spécifiée n'existe pas" });
        }
      }

      // Préparer les données à mettre à jour
      const dataToUpdate = {
        ...req.body,
        updated_at: new Date(),
      };

      try {
        // Mettre à jour le badge
        const [updatedBadge] = await db("badges")
          .where("id", id)
          .update(dataToUpdate)
          .returning([
            "id",
            "name",
            "type",
            "illustration_id",
            "collections_id",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedBadge);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Une des références (admin_id, collections_id) n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime un badge par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si le badge existe
      const badgeExists = await db("badges").where("id", id).first();
      if (!badgeExists) {
        return res.status(404).json({ error: "Badge introuvable" });
      }

      // Vérifier si le badge est utilisé dans user_badges
      const badgeInUse = await db("user_badges").where("badge_id", id).first();
      if (badgeInUse) {
        return res.status(409).json({
          error:
            "Ce badge est attribué à des utilisateurs et ne peut pas être supprimé",
        });
      }

      try {
        // Supprimer le badge
        const [deletedBadge] = await db("badges")
          .where("id", id)
          .del()
          .returning([
            "id",
            "name",
            "type",
            "illustration_id",
            "collections_id",
            "admin_id",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedBadge);
      } catch (error) {
        console.error("Erreur de suppression:", error);
        return res
          .status(500)
          .json({ error: `Erreur lors de la suppression: ${error.message}` });
      }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
