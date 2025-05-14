import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les associations utilisateur-offre
const userOfferSchema = Yup.object({
  user_id: Yup.number().required("L'identifiant de l'utilisateur est requis"),
  offer_id: Yup.number().required("L'identifiant de l'offre est requis"),
});

// Validation des données
async function validateData(data) {
  try {
    return await userOfferSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les associations ou une association spécifique
    if (req.method === "GET") {
      const { id, user_id, offer_id } = req.query;

      if (id) {
        // Récupérer une association spécifique par ID
        const userOffer = await db("user_offers").where("id", id).first();
        if (!userOffer) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-offre introuvable" });
        }
        return res.status(200).json(userOffer);
      } else if (user_id) {
        // Récupérer toutes les offres d'un utilisateur spécifique avec détails sur les offres
        const userOffers = await db("user_offers")
          .select([
            "user_offers.id",
            "user_offers.user_id",
            "user_offers.offer_id",
            "user_offers.created_at",
            "user_offers.updated_at",
            "offers.title",
            "offers.description",
            "offers.type",
            "offers.status",
            "offers.lifetime",
          ])
          .join("offers", "user_offers.offer_id", "=", "offers.id")
          .where("user_offers.user_id", user_id);

        return res.status(200).json(userOffers);
      } else if (offer_id) {
        // Récupérer tous les utilisateurs qui ont une offre spécifique avec détails sur les utilisateurs
        const userOffers = await db("user_offers")
          .select([
            "user_offers.id",
            "user_offers.user_id",
            "user_offers.offer_id",
            "user_offers.created_at",
            "user_offers.updated_at",
            "users.username",
            "users.email",
            "users.role",
          ])
          .join("users", "user_offers.user_id", "=", "users.id")
          .where("user_offers.offer_id", offer_id);

        return res.status(200).json(userOffers);
      } else {
        // Récupérer toutes les associations
        const userOffers = await db("user_offers");
        return res.status(200).json(userOffers);
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

      // Vérifier si l'offre existe et est active
      const offerExists = await db("offers")
        .where("id", req.body.offer_id)
        .where("status", 1)
        .first();

      if (!offerExists) {
        return res.status(404).json({
          error: "L'offre spécifiée n'existe pas ou n'est pas active",
        });
      }

      // Vérifier si l'association existe déjà
      const existingAssociation = await db("user_offers")
        .where({
          user_id: req.body.user_id,
          offer_id: req.body.offer_id,
        })
        .first();

      if (existingAssociation) {
        return res.status(409).json({
          error: "Cet utilisateur a déjà utilisé cette offre",
          association: existingAssociation,
        });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newUserOffer] = await db("user_offers")
          .insert(validatedData)
          .returning(["id", "user_id", "offer_id", "created_at", "updated_at"]);

        return res.status(201).json(newUserOffer);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "L'utilisateur ou l'offre spécifiée n'existe pas",
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
      const existingUserOffer = await db("user_offers").where("id", id).first();
      if (!existingUserOffer) {
        return res
          .status(404)
          .json({ error: "Association utilisateur-offre introuvable" });
      }

      // Mettre à jour updated_at
      try {
        const [updatedUserOffer] = await db("user_offers")
          .where("id", id)
          .update({ updated_at: new Date() })
          .returning(["id", "user_id", "offer_id", "created_at", "updated_at"]);

        return res.status(200).json(updatedUserOffer);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);
        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une association par ID ou par paire user_id/offer_id
    if (req.method === "DELETE") {
      const { id, user_id, offer_id } = req.query;

      if (id) {
        // Vérifier si l'association existe
        const userOfferExists = await db("user_offers").where("id", id).first();
        if (!userOfferExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-offre introuvable" });
        }

        try {
          // Supprimer l'association
          const [deletedUserOffer] = await db("user_offers")
            .where("id", id)
            .del()
            .returning([
              "id",
              "user_id",
              "offer_id",
              "created_at",
              "updated_at",
            ]);

          return res.status(200).json({
            message: "Association supprimée avec succès",
            data: deletedUserOffer,
          });
        } catch (error) {
          console.error("Erreur de suppression:", error);
          return res
            .status(500)
            .json({ error: `Erreur lors de la suppression: ${error.message}` });
        }
      } else if (user_id && offer_id) {
        // Vérifier si l'association existe
        const userOfferExists = await db("user_offers")
          .where({
            user_id: user_id,
            offer_id: offer_id,
          })
          .first();

        if (!userOfferExists) {
          return res
            .status(404)
            .json({ error: "Association utilisateur-offre introuvable" });
        }

        try {
          // Supprimer l'association
          const [deletedUserOffer] = await db("user_offers")
            .where({
              user_id: user_id,
              offer_id: offer_id,
            })
            .del()
            .returning([
              "id",
              "user_id",
              "offer_id",
              "created_at",
              "updated_at",
            ]);

          return res.status(200).json({
            message: "Association supprimée avec succès",
            data: deletedUserOffer,
          });
        } catch (error) {
          console.error("Erreur de suppression:", error);
          return res
            .status(500)
            .json({ error: `Erreur lors de la suppression: ${error.message}` });
        }
      } else {
        return res
          .status(400)
          .json({
            error: "ID ou paire user_id/offer_id requis pour la suppression",
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
