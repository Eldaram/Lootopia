import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les maps
const mapSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  skin: Yup.number().default(1),
  zone: Yup.string().default(""),
  scale: Yup.string().default("1:1000"),
  partner_id: Yup.number().required("Le créateur est requis"),
  status: Yup.number().default(1),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data) {
  try {
    // Valider et appliquer les valeurs par défaut
    const validatedData = await mapSchema.validate(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    // Ajouter le created_at si c'est une nouvelle entrée
    if (!data.id) {
      validatedData.created_at = new Date();
    }

    return validatedData;
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les maps ou une map spécifique
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        // Récupérer une map spécifique par ID
        const map = await db("maps").where("id", id).first();

        if (!map) {
          return res.status(404).json({ error: "Map introuvable" });
        }

        return res.status(200).json(map);
      } else {
        // Récupérer toutes les maps
        const maps = await db("maps");
        return res.status(200).json(maps);
      }
    }

    // Méthode POST : Ajoute une nouvelle map
    if (req.method === "POST") {
      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(req.body);

      // Insérer dans la base de données et récupérer l'entrée complète
      const [newMap] = await db("maps").insert(validatedData).returning("*");

      return res.status(201).json(newMap);
    }

    // Méthode PUT : Met à jour une map existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingMap = await db("maps").where("id", id).first();
      if (!existingMap) {
        return res.status(404).json({ error: "Map introuvable" });
      }

      // Fusionner les données existantes avec les nouvelles données
      const mergedData = { ...existingMap, ...req.body };

      // Valider et appliquer les valeurs par défaut
      const validatedData = await validateAndApplyDefaults(mergedData);

      // Ajouter updated_at
      validatedData.updated_at = new Date();

      // Mettre à jour et récupérer l'entrée complète
      const [updatedMap] = await db("maps")
        .where("id", id)
        .update(validatedData)
        .returning("*");

      return res.status(200).json(updatedMap);
    }

    // Méthode DELETE : Supprime une map par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si la map existe
      const mapExists = await db("maps").where("id", id).first();
      if (!mapExists) {
        return res.status(404).json({ error: "Map introuvable" });
      }

      // Vérifier si la map est utilisée dans des chasses
      const huntsUsingMap = await db("hunts").where("map_id", id).first();
      if (huntsUsingMap) {
        // Option 1: Empêcher la suppression et renvoyer une erreur
        return res.status(409).json({
          error:
            "Cette map ne peut pas être supprimée car elle est utilisée dans des chasses au trésor",
        });

        // Option 2: Alternativement, vous pourriez désactiver la map au lieu de la supprimer
        // await db("maps").where("id", id).update({
        //   status: 0,
        //   updated_at: new Date(),
        //   disabled_time: db.raw("CURRENT_TIME"),
        //   disabled_start: new Date()
        // });
        // return res.status(200).json({ message: "Map désactivée" });
      }

      // Supprimer la map et retourner les données supprimées
      const [deletedMap] = await db("maps")
        .where("id", id)
        .del()
        .returning("*");

      return res.status(200).json(deletedMap);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
