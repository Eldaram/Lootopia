import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les associations utilisateur-badge
const userBadgeSchema = Yup.object({
  user_id: Yup.number().required("L'identifiant de l'utilisateur est requis"),
  badge_id: Yup.number().required("L'identifiant du badge est requis"),
});

// Validation des données
async function validateData(data) {
  try {
    return await userBadgeSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les associations ou une association spécifique
    if (req.method === "GET") {
      const { id, user_id, badge_id } = req.query;

      if (id) {
        // Récupérer une association spécifique par ID
        const userBadge = await db("user_badges").where("id", id).first();
        if (!userBadge) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-badge introuvable" });
        }
        return res.status(200).json(userBadge);
      } else if (user_id) {
        // Récupérer tous les badges d'un utilisateur spécifique
        const userBadges = await db("user_badges")
          .select([
            "user_badges.*",
            "badges.name",
            "badges.type",
            "badges.status",
          ])
          .join("badges", "user_badges.badge_id", "=", "badges.id")
          .where("user_badges.user_id", user_id);
        return res.status(200).json(userBadges);
      } else if (badge_id) {
        // Récupérer tous les utilisateurs qui ont un badge spécifique
        const userBadges = await db("user_badges")
          .select(["user_badges.*", "users.username", "users.email"])
          .join("users", "user_badges.user_id", "=", "users.id")
          .where("user_badges.badge_id", badge_id);
        return res.status(200).json(userBadges);
      } else {
        // Récupérer toutes les associations
        const userBadges = await db("user_badges");
        return res.status(200).json(userBadges);
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

      // Vérifier si le badge existe
      const badgeExists = await db("badges")
        .where("id", req.body.badge_id)
        .first();
      if (!badgeExists) {
        return res
          .status(404)
          .json({ error: "Le badge spécifié n'existe pas" });
      }

      // Vérifier si l'association existe déjà
      const existingAssociation = await db("user_badges")
        .where({
          user_id: req.body.user_id,
          badge_id: req.body.badge_id,
        })
        .first();

      if (existingAssociation) {
        return res.status(409).json({
          error: "Cet utilisateur possède déjà ce badge",
          association: existingAssociation,
        });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newUserBadge] = await db("user_badges")
          .insert(validatedData)
          .returning(["id", "user_id", "badge_id", "created_at"]);

        return res.status(201).json(newUserBadge);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'utilisateur ou le badge spécifié n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une association par ID ou par paire user_id/badge_id
    if (req.method === "DELETE") {
      const { id, user_id, badge_id } = req.query;

      if (id) {
        // Vérifier si l'association existe
        const userBadgeExists = await db("user_badges").where("id", id).first();
        if (!userBadgeExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-badge introuvable" });
        }

        // Supprimer l'association
        const [deletedUserBadge] = await db("user_badges")
          .where("id", id)
          .del()
          .returning(["id", "user_id", "badge_id", "created_at"]);

        return res.status(200).json(deletedUserBadge);
      } else if (user_id && badge_id) {
        // Vérifier si l'association existe
        const userBadgeExists = await db("user_badges")
          .where({
            user_id: user_id,
            badge_id: badge_id,
          })
          .first();

        if (!userBadgeExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-badge introuvable" });
        }

        // Supprimer l'association
        const [deletedUserBadge] = await db("user_badges")
          .where({
            user_id: user_id,
            badge_id: badge_id,
          })
          .del()
          .returning(["id", "user_id", "badge_id", "created_at"]);

        return res.status(200).json(deletedUserBadge);
      } else {
        return res
          .status(400)
          .json({
            error: "ID ou paire user_id/badge_id requis pour la suppression",
          });
      }
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
