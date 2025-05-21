import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les autres récompenses
const otherRewardSchema = Yup.object({
  type: Yup.number().nullable().default(null),
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().nullable().default(null),
  partner_id: Yup.number().required("L'identifiant du partenaire est requis"),
  status: Yup.number().default(1),
  lifetime: Yup.string().nullable().default(null),
});

// Validation des données
async function validateData(data) {
  try {
    return await otherRewardSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les récompenses ou une récompense spécifique
    if (req.method === "GET") {
      const { id, partner_id } = req.query;

      if (id) {
        const reward = await db("other_rewards").where("id", id).first();
        if (!reward) {
          return res.status(404).json({ error: "Récompense introuvable" });
        }
        return res.status(200).json(reward);
      } else if (partner_id) {
        // Récupérer toutes les récompenses d'un partenaire spécifique
        const rewards = await db("other_rewards").where(
          "partner_id",
          partner_id
        );
        return res.status(200).json(rewards);
      } else {
        const rewards = await db("other_rewards");
        return res.status(200).json(rewards);
      }
    }

    // Méthode POST : Ajoute une nouvelle récompense
    if (req.method === "POST") {
      // Vérifier si partner_id existe
      const partnerExists = await db("users")
        .where("id", req.body.partner_id)
        .first();
      if (!partnerExists) {
        return res
          .status(404)
          .json({ error: "Le partenaire spécifié n'existe pas" });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newReward] = await db("other_rewards")
          .insert(validatedData)
          .returning([
            "id",
            "type",
            "title",
            "description",
            "partner_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(201).json(newReward);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Le partenaire spécifié n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode PUT : Met à jour une récompense existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingReward = await db("other_rewards").where("id", id).first();
      if (!existingReward) {
        return res.status(404).json({ error: "Récompense introuvable" });
      }

      // Vérifier si partner_id existe (si fourni)
      if (
        req.body.partner_id &&
        req.body.partner_id !== existingReward.partner_id
      ) {
        const partnerExists = await db("users")
          .where("id", req.body.partner_id)
          .first();
        if (!partnerExists) {
          return res
            .status(404)
            .json({ error: "Le partenaire spécifié n'existe pas" });
        }
      }

      // Préparer les données à mettre à jour
      const dataToUpdate = {
        ...req.body,
        updated_at: new Date(),
      };

      try {
        // Mettre à jour la récompense
        const [updatedReward] = await db("other_rewards")
          .where("id", id)
          .update(dataToUpdate)
          .returning([
            "id",
            "type",
            "title",
            "description",
            "partner_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(200).json(updatedReward);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Le partenaire spécifié n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une récompense par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si la récompense existe
      const rewardExists = await db("other_rewards").where("id", id).first();
      if (!rewardExists) {
        return res.status(404).json({ error: "Récompense introuvable" });
      }

      // Vérifier si la récompense est attribuée à des utilisateurs
      const rewardInUse = await db("user_other_rewards")
        .where("other_reward_id", id)
        .first();
      if (rewardInUse) {
        return res.status(409).json({
          error:
            "Cette récompense est attribuée à des utilisateurs et ne peut pas être supprimée",
        });
      }

      try {
        // Supprimer la récompense
        const [deletedReward] = await db("other_rewards")
          .where("id", id)
          .del()
          .returning([
            "id",
            "type",
            "title",
            "description",
            "partner_id",
            "status",
            "created_at",
            "updated_at",
            "lifetime",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(200).json(deletedReward);
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
