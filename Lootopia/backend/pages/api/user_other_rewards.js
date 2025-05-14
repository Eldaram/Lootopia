import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les associations utilisateur-récompense
const userOtherRewardSchema = Yup.object({
  user_id: Yup.number().required("L'identifiant de l'utilisateur est requis"),
  other_reward_id: Yup.number().required(
    "L'identifiant de la récompense est requis"
  ),
});

// Validation des données
async function validateData(data) {
  try {
    return await userOtherRewardSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les associations ou une association spécifique
    if (req.method === "GET") {
      const { id, user_id, other_reward_id } = req.query;

      if (id) {
        // Récupérer une association spécifique par ID
        const userReward = await db("user_other_rewards")
          .where("id", id)
          .first();
        if (!userReward) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-récompense introuvable" });
        }
        return res.status(200).json(userReward);
      } else if (user_id) {
        // Récupérer toutes les récompenses d'un utilisateur spécifique
        const userRewards = await db("user_other_rewards")
          .select([
            "user_other_rewards.*",
            "other_rewards.title",
            "other_rewards.description",
            "other_rewards.type",
          ])
          .join(
            "other_rewards",
            "user_other_rewards.other_reward_id",
            "=",
            "other_rewards.id"
          )
          .where("user_other_rewards.user_id", user_id);
        return res.status(200).json(userRewards);
      } else if (other_reward_id) {
        // Récupérer tous les utilisateurs qui ont une récompense spécifique
        const userRewards = await db("user_other_rewards")
          .select(["user_other_rewards.*", "users.username", "users.email"])
          .join("users", "user_other_rewards.user_id", "=", "users.id")
          .where("user_other_rewards.other_reward_id", other_reward_id);
        return res.status(200).json(userRewards);
      } else {
        // Récupérer toutes les associations
        const userRewards = await db("user_other_rewards");
        return res.status(200).json(userRewards);
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

      // Vérifier si la récompense existe
      const rewardExists = await db("other_rewards")
        .where("id", req.body.other_reward_id)
        .first();
      if (!rewardExists) {
        return res
          .status(404)
          .json({ error: "La récompense spécifiée n'existe pas" });
      }

      // Vérifier si l'association existe déjà
      const existingAssociation = await db("user_other_rewards")
        .where({
          user_id: req.body.user_id,
          other_reward_id: req.body.other_reward_id,
        })
        .first();

      if (existingAssociation) {
        return res.status(409).json({
          error: "Cet utilisateur possède déjà cette récompense",
          association: existingAssociation,
        });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newUserReward] = await db("user_other_rewards")
          .insert(validatedData)
          .returning([
            "id",
            "user_id",
            "other_reward_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newUserReward);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'utilisateur ou la récompense spécifiée n'existe pas",
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
      const existingUserReward = await db("user_other_rewards")
        .where("id", id)
        .first();
      if (!existingUserReward) {
        return res
          .status(404)
          .json({ error: "Association utilisateur-récompense introuvable" });
      }

      // Mettre à jour updated_at
      try {
        const [updatedUserReward] = await db("user_other_rewards")
          .where("id", id)
          .update({ updated_at: new Date() })
          .returning([
            "id",
            "user_id",
            "other_reward_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedUserReward);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);
        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une association par ID ou par paire user_id/other_reward_id
    if (req.method === "DELETE") {
      const { id, user_id, other_reward_id } = req.query;

      if (id) {
        // Vérifier si l'association existe
        const userRewardExists = await db("user_other_rewards")
          .where("id", id)
          .first();
        if (!userRewardExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-récompense introuvable" });
        }

        // Supprimer l'association
        const [deletedUserReward] = await db("user_other_rewards")
          .where("id", id)
          .del()
          .returning([
            "id",
            "user_id",
            "other_reward_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedUserReward);
      } else if (user_id && other_reward_id) {
        // Vérifier si l'association existe
        const userRewardExists = await db("user_other_rewards")
          .where({
            user_id: user_id,
            other_reward_id: other_reward_id,
          })
          .first();

        if (!userRewardExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-récompense introuvable" });
        }

        // Supprimer l'association
        const [deletedUserReward] = await db("user_other_rewards")
          .where({
            user_id: user_id,
            other_reward_id: other_reward_id,
          })
          .del()
          .returning([
            "id",
            "user_id",
            "other_reward_id",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedUserReward);
      } else {
        return res
          .status(400)
          .json({
            error:
              "ID ou paire user_id/other_reward_id requis pour la suppression",
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
