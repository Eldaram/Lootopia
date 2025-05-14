import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les couleurs de partenaire
const partnerColorSchema = Yup.object({
  partner_id: Yup.number().required("L'identifiant du partenaire est requis"),
  hex_color: Yup.string()
    .required("La couleur hexadécimale est requise")
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "Format de couleur hexadécimale invalide (ex: #FF5733)"
    ),
  status: Yup.number().default(1),
});

// Validation des données
async function validateData(data) {
  try {
    return await partnerColorSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les couleurs ou une couleur spécifique
    if (req.method === "GET") {
      const { id, partner_id } = req.query;

      if (id) {
        // Récupérer une couleur spécifique par ID
        const partnerColor = await db("partner_colors").where("id", id).first();
        if (!partnerColor) {
          return res
            .status(404)
            .json({ error: "Couleur de partenaire introuvable" });
        }
        return res.status(200).json(partnerColor);
      } else if (partner_id) {
        // Récupérer toutes les couleurs d'un partenaire spécifique
        const partnerColors = await db("partner_colors")
          .where("partner_id", partner_id)
          .orderBy("created_at", "desc");
        return res.status(200).json(partnerColors);
      } else {
        // Récupérer toutes les couleurs
        const partnerColors = await db("partner_colors");
        return res.status(200).json(partnerColors);
      }
    }

    // Méthode POST : Ajoute une nouvelle couleur
    if (req.method === "POST") {
      // Vérifier si le partenaire existe et est bien un partenaire
      const partnerExists = await db("users")
        .where("id", req.body.partner_id)
        .where("role", "partner")
        .first();

      if (!partnerExists) {
        return res
          .status(404)
          .json({
            error:
              "Le partenaire spécifié n'existe pas ou n'a pas le rôle de partenaire",
          });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newPartnerColor] = await db("partner_colors")
          .insert(validatedData)
          .returning([
            "id",
            "partner_id",
            "hex_color",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(201).json(newPartnerColor);
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

    // Méthode PUT : Met à jour une couleur existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingPartnerColor = await db("partner_colors")
        .where("id", id)
        .first();
      if (!existingPartnerColor) {
        return res
          .status(404)
          .json({ error: "Couleur de partenaire introuvable" });
      }

      // Vérifier si partner_id existe et est un partenaire (si fourni)
      if (
        req.body.partner_id &&
        req.body.partner_id !== existingPartnerColor.partner_id
      ) {
        const partnerExists = await db("users")
          .where("id", req.body.partner_id)
          .where("role", "partner")
          .first();
        if (!partnerExists) {
          return res
            .status(404)
            .json({
              error:
                "Le partenaire spécifié n'existe pas ou n'a pas le rôle de partenaire",
            });
        }
      }

      // Vérifier le format de la couleur hexadécimale (si fournie)
      if (req.body.hex_color && !/^#[0-9A-Fa-f]{6}$/.test(req.body.hex_color)) {
        return res
          .status(400)
          .json({
            error: "Format de couleur hexadécimale invalide (ex: #FF5733)",
          });
      }

      // Préparer les données à mettre à jour
      const dataToUpdate = {
        ...req.body,
        updated_at: new Date(),
      };

      try {
        // Mettre à jour la couleur
        const [updatedPartnerColor] = await db("partner_colors")
          .where("id", id)
          .update(dataToUpdate)
          .returning([
            "id",
            "partner_id",
            "hex_color",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(updatedPartnerColor);
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

    // Méthode DELETE : Supprime une couleur par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si la couleur existe
      const partnerColorExists = await db("partner_colors")
        .where("id", id)
        .first();
      if (!partnerColorExists) {
        return res
          .status(404)
          .json({ error: "Couleur de partenaire introuvable" });
      }

      // Compter le nombre total de couleurs pour ce partenaire
      const colorCount = await db("partner_colors")
        .where("partner_id", partnerColorExists.partner_id)
        .count("id as count")
        .first();

      // Empêcher la suppression si c'est la dernière couleur
      if (colorCount.count === "1" || colorCount.count === 1) {
        return res.status(409).json({
          error: "Impossible de supprimer la dernière couleur d'un partenaire",
        });
      }

      try {
        // Supprimer la couleur
        const [deletedPartnerColor] = await db("partner_colors")
          .where("id", id)
          .del()
          .returning([
            "id",
            "partner_id",
            "hex_color",
            "status",
            "created_at",
            "updated_at",
          ]);

        return res.status(200).json(deletedPartnerColor);
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
