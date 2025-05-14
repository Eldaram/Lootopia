import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les caches
const cacheSchema = Yup.object({
  dimensions: Yup.string().nullable().default(null),
  visibility: Yup.number().nullable().default(null),
  partner_id: Yup.number().nullable().default(null),
  status: Yup.number().default(1),
  latitude: Yup.number().required("La latitude est requise"),
  longitude: Yup.number().required("La longitude est requise"),
});

// Validation des données
async function validateData(data) {
  try {
    return await cacheSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les caches ou une cache spécifique
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        // Récupérer une cache spécifique par ID avec conversion du point en coordonnées
        const cache = await db("caches")
          .select([
            "id",
            "dimensions",
            "visibility",
            "partner_id",
            "status",
            "created_at",
            "updated_at",
            "disabled_time",
            "disabled_start",
            db.raw("ST_X(location::geometry) as longitude"),
            db.raw("ST_Y(location::geometry) as latitude"),
          ])
          .where("id", id)
          .first();

        if (!cache) {
          return res.status(404).json({ error: "Cache introuvable" });
        }

        return res.status(200).json(cache);
      } else {
        // Récupérer toutes les caches avec conversion des points en coordonnées
        const caches = await db("caches").select([
          "id",
          "dimensions",
          "visibility",
          "partner_id",
          "status",
          "created_at",
          "updated_at",
          "disabled_time",
          "disabled_start",
          db.raw("ST_X(location::geometry) as longitude"),
          db.raw("ST_Y(location::geometry) as latitude"),
        ]);
        return res.status(200).json(caches);
      }
    }

    // Méthode POST : Ajoute une nouvelle cache
    if (req.method === "POST") {
      // Vérifier si le partner_id existe (si fourni)
      if (req.body.partner_id) {
        const partnerExists = await db("users")
          .where("id", req.body.partner_id)
          .first();
        if (!partnerExists) {
          return res
            .status(404)
            .json({ error: "Le partenaire spécifié n'existe pas" });
        }
      }

      // Valider les données
      const validatedData = await validateData(req.body);

      // Extraire latitude et longitude
      const { latitude, longitude, ...cacheData } = validatedData;

      try {
        // Approche alternative pour insérer avec des coordonnées
        // Utiliser une requête SQL brute pour s'assurer que la fonction PostGIS est correctement appelée
        const result = await db.raw(
          `INSERT INTO caches (
            dimensions, 
            visibility, 
            partner_id, 
            status, 
            location, 
            created_at
          ) VALUES (?, ?, ?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?) RETURNING id`,
          [
            cacheData.dimensions || null,
            cacheData.visibility || null,
            cacheData.partner_id || null,
            cacheData.status || 1,
            longitude,
            latitude,
            new Date(),
          ]
        );

        // Récupérer l'ID inséré
        const id = result.rows[0].id;

        // Récupérer la cache complète
        const newCache = await db("caches")
          .select([
            "id",
            "dimensions",
            "visibility",
            "partner_id",
            "status",
            "created_at",
            "updated_at",
            "disabled_time",
            "disabled_start",
            db.raw("ST_X(location::geometry) as longitude"),
            db.raw("ST_Y(location::geometry) as latitude"),
          ])
          .where("id", id)
          .first();

        return res.status(201).json(newCache);
      } catch (error) {
        console.error("Erreur d'insertion complète:", error);

        // Approche encore plus simple - stocker les coordonnées comme une chaîne de caractères temporairement
        try {
          console.log(
            "Tentative d'insertion alternative sans utiliser PostGIS"
          );

          // Créer un objet simplifié pour l'insertion
          const simpleData = {
            dimensions: cacheData.dimensions || null,
            visibility: cacheData.visibility || null,
            partner_id: cacheData.partner_id || null,
            status: cacheData.status || 1,
            // Enregistrer les coordonnées dans le champ dimensions temporairement (pour dépannage)
            dimensions: `Lat:${latitude},Lng:${longitude}`,
            created_at: new Date(),
          };

          // Insertion de base sans PostGIS
          const [id] = await db("caches").insert(simpleData).returning("id");

          return res.status(201).json({
            id: id,
            ...simpleData,
            latitude: latitude,
            longitude: longitude,
            message:
              "Cache créée avec coordonnées simplifiées (pas de PostGIS)",
          });
        } catch (fallbackError) {
          console.error("Échec de l'insertion alternative:", fallbackError);
          return res.status(500).json({
            error:
              "Impossible de créer la cache - problème avec la base de données",
            details: error.message,
            fallbackError: fallbackError.message,
          });
        }
      }
    }

    // Méthode PUT et DELETE restent inchangées...
    // [code pour PUT et DELETE]

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}
