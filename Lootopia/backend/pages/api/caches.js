// api/caches.js - API pour gérer les étapes/caches des chasses
import * as Yup from "yup";
import db from "../../services/db.js";

// Schéma de validation pour les caches/étapes
const cacheSchema = Yup.object({
  title: Yup.string()
    .required("Le titre de l'étape est requis")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim(),

  latitude: Yup.number()
    .min(-90, "La latitude doit être comprise entre -90 et 90")
    .max(90, "La latitude doit être comprise entre -90 et 90")
    .required("La latitude est requise"),

  longitude: Yup.number()
    .min(-180, "La longitude doit être comprise entre -180 et 180")
    .max(180, "La longitude doit être comprise entre -180 et 180")
    .required("La longitude est requise"),

  dimensions: Yup.number()
    .integer()
    .min(1, "Les dimensions doivent être d'au moins 1")
    .max(9999, "Les dimensions sont trop importantes")
    .default(1),

  dimensionUnit: Yup.string()
    .oneOf(["metre", "kilometre", "centimetre"], "Unité de dimension invalide")
    .default("metre"),

  visibility: Yup.number()
    .integer("La visibilité doit être un entier")
    .min(0, "Valeur trop basse")
    .max(32767, "Valeur trop élevée") // Limite du smallint PostgreSQL
    .default(1)
    .required("La visibilité est requise"),

  type: Yup.string()
    .oneOf(
      ["qr_code", "image", "texte", "cache_finale", "geolocation", "puzzle"],
      "Type d'étape invalide"
    )
    .required("Le type d'étape est requis"),

  content: Yup.string()
    .max(1000, "Le contenu ne peut pas dépasser 1000 caractères")
    .default(""),

  reward_collection: Yup.string().nullable().default(null),

  reward_item: Yup.string().nullable().default(null),

  hunt_id: Yup.number()
    .required("Une chasse doit être associée à cette étape")
    .integer()
    .min(1, "L'ID de la chasse doit être valide"),

  partner_id: Yup.number()
    .integer()
    .min(1, "L'ID du partenaire doit être valide")
    .required("Le créateur est requis"),

  order_index: Yup.number()
    .integer()
    .min(0, "L'ordre doit être positif")
    .default(0),

  status: Yup.number()
    .integer()
    .min(0, "Le statut doit être valide")
    .max(2, "Le statut doit être valide")
    .default(1), // 0: inactif, 1: actif, 2: complété

  difficulty: Yup.number()
    .integer()
    .min(1, "La difficulté doit être entre 1 et 5")
    .max(5, "La difficulté doit être entre 1 et 5")
    .default(1),

  points: Yup.number()
    .integer()
    .min(0, "Les points doivent être positifs")
    .max(1000, "Trop de points")
    .default(10),

  image_url: Yup.string()
    .url("L'URL de l'image doit être valide")
    .nullable()
    .default(null),

  hint: Yup.string()
    .max(500, "L'indice ne peut pas dépasser 500 caractères")
    .default(""),
});

// Validation et transformation des données
async function validateAndTransformCacheData(data, isUpdate = false) {
  try {
    const validatedData = await cacheSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Création d'une géométrie PostGIS (POINT)
    validatedData.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)`, [
      validatedData.longitude,
      validatedData.latitude,
    ]);

    // Supprime les champs latitude/longitude après transformation
    delete validatedData.latitude;
    delete validatedData.longitude;

    // Ajouter les timestamps
    if (!isUpdate) {
      validatedData.created_at = new Date();
    }
    validatedData.updated_at = new Date();

    return validatedData;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Erreur de validation: ${error.errors.join(", ")}`);
    }
    throw error;
  }
}

// Fonction pour formater les données pour le frontend
function formatCacheForFrontend(cache) {
  const formatted = { ...cache };

  // Ajouter des informations utiles
  formatted.type_label = getCacheTypeLabel(cache.type);
  formatted.status_label = getCacheStatusLabel(cache.status);
  formatted.difficulty_label = getDifficultyLabel(cache.difficulty);
  formatted.dimension_display = `${cache.dimensions} ${cache.dimensionUnit}`;
  formatted.is_active = cache.status === 1;
  formatted.has_reward = !!(cache.reward_collection && cache.reward_item);
  formatted.latitude = cache.location?.y ?? null;
  formatted.longitude = cache.location?.x ?? null;

  return formatted;
}

// Fonctions utilitaires pour les libellés
function getCacheTypeLabel(type) {
  const typeLabels = {
    qr_code: "📱 QR Code",
    image: "🖼️ Image",
    texte: "📝 Texte",
    cache_finale: "🏆 Cache Finale",
    geolocation: "📍 Géolocalisation",
    puzzle: "🧩 Puzzle",
  };
  return typeLabels[type] || type;
}

function getCacheStatusLabel(status) {
  const statusLabels = {
    0: "Inactif",
    1: "Actif",
    2: "Complété",
  };
  return statusLabels[status] || "Inconnu";
}

function getDifficultyLabel(difficulty) {
  const stars = "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  return `${stars} (${difficulty}/5)`;
}

// Fonction pour gérer l'ordre des étapes
async function updateCacheOrder(cacheId, newOrderIndex, huntId = null) {
  try {
    let query = db("caches");

    if (huntId) {
      query = query.where("hunt_id", huntId);
    }

    const cache = await db("caches").where("id", cacheId).first();
    if (!cache) {
      throw new Error("Étape introuvable");
    }

    const oldOrderIndex = cache.order_index;

    if (newOrderIndex > oldOrderIndex) {
      // Déplacer vers le bas
      await db("caches")
        .where("hunt_id", cache.hunt_id)
        .whereBetween("order_index", [oldOrderIndex + 1, newOrderIndex])
        .decrement("order_index", 1);
    } else if (newOrderIndex < oldOrderIndex) {
      // Déplacer vers le haut
      await db("caches")
        .where("hunt_id", cache.hunt_id)
        .whereBetween("order_index", [newOrderIndex, oldOrderIndex - 1])
        .increment("order_index", 1);
    }

    // Mettre à jour l'ordre de l'étape cible
    await db("caches")
      .where("id", cacheId)
      .update({ order_index: newOrderIndex, updated_at: new Date() });

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ordre:", error);
    throw error;
  }
}

// Handler principal de l'API
export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Gérer la requête préliminaire OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Répondre OK sans rien faire d'autre
  }

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    console.log("[CACHE API] Réponse OPTIONS");
    return res.status(204).end();
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGetCaches(req, res);
      case "POST":
        return await handlePostCache(req, res);
      case "PUT":
        return await handlePutCache(req, res);
      case "DELETE":
        return await handleDeleteCache(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
        return res.status(405).json({
          error: `Méthode ${req.method} non autorisée`,
          allowed: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        });
    }
  } catch (error) {
    console.error("[CACHE API] Erreur:", error);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Service de base de données indisponible",
        message: "Veuillez réessayer plus tard",
      });
    }

    return res.status(500).json({
      error: "Erreur serveur interne",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Handler GET - Récupérer les caches/étapes
async function handleGetCaches(req, res) {
  const { id, hunt_id, partner_id, type, status, order_by } = req.query;

  try {
    let query = db("caches");

    // Filtres
    if (id) {
      query = query.where("id", id);
    }

    if (hunt_id) {
      query = query.where("hunt_id", hunt_id);
    }

    if (partner_id) {
      query = query.where("partner_id", partner_id);
    }

    if (type) {
      query = query.where("type", type);
    }

    if (status !== undefined) {
      query = query.where("status", status);
    }

    // Tri
    switch (order_by) {
      case "title":
        query = query.orderBy("title", "asc");
        break;
      case "difficulty":
        query = query.orderBy("difficulty", "desc");
        break;
      case "points":
        query = query.orderBy("points", "desc");
        break;
      case "created":
        query = query.orderBy("created_at", "desc");
        break;
      default:
        query = query
          .orderBy("order_index", "asc")
          .orderBy("created_at", "asc");
    }

    const caches = await query;

    if (!caches || caches.length === 0) {
      if (id) {
        return res.status(404).json({
          error: "Étape introuvable",
          id: id,
        });
      }
      return res.status(200).json([]);
    }

    // Formater les données pour le frontend
    const formattedCaches = caches.map((cache) =>
      formatCacheForFrontend(cache)
    );

    // Si on demande une étape spécifique, retourner l'objet directement
    if (id) {
      return res.status(200).json(formattedCaches[0]);
    }

    console.log(`[CACHE API] Retour de ${formattedCaches.length} étape(s)`);
    return res.status(200).json(formattedCaches);
  } catch (error) {
    console.error("[CACHE API] Erreur GET:", error);
    throw error;
  }
}

// Handler POST - Créer une nouvelle étape
async function handlePostCache(req, res) {
  try {
    console.log("[CACHE API] Création d'une nouvelle étape");

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corps de la requête vide",
        message: "Veuillez fournir les données de l'étape",
      });
    }

    // Valider et transformer les données
    const validatedData = await validateAndTransformCacheData(req.body, false);

    // Si c'est associé à une chasse, définir l'ordre automatiquement
    if (validatedData.hunt_id) {
      const maxOrder = await db("caches")
        .where("hunt_id", validatedData.hunt_id)
        .max("order_index as max")
        .first();

      validatedData.order_index = (maxOrder?.max || -1) + 1;
    }

    console.log("[CACHE API] Données validées:", validatedData);

    // Insérer dans la base de données
    const [newCache] = await db("caches").insert(validatedData).returning("*");

    if (!newCache) {
      throw new Error("Échec de la création de l'étape");
    }

    console.log("[CACHE API] Étape créée avec l'ID:", newCache.id);

    // Formater pour le frontend
    const formattedCache = formatCacheForFrontend(newCache);

    return res.status(201).json({
      success: true,
      message: "Étape créée avec succès",
      data: formattedCache,
    });
  } catch (error) {
    console.error("[CACHE API] Erreur POST:", error);

    if (error.message.includes("Erreur de validation")) {
      return res.status(400).json({
        error: "Données invalides",
        message: error.message,
        code: "VALIDATION_ERROR",
      });
    }

    throw error;
  }
}

// Handler PUT - Mettre à jour une étape
async function handlePutCache(req, res) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({
        error: "ID requis",
        message: "Veuillez spécifier l'ID de l'étape à modifier",
      });
    }

    console.log(`[CACHE API] Modification de l'étape ID: ${id}`);

    // Vérifier que l'étape existe
    const existingCache = await db("caches").where("id", id).first();

    if (!existingCache) {
      return res.status(404).json({
        error: "Étape introuvable",
        id: id,
      });
    }

    // Si on change l'ordre, gérer le réordonnancement
    if (
      req.body.order_index !== undefined &&
      req.body.order_index !== existingCache.order_index
    ) {
      await updateCacheOrder(id, req.body.order_index, existingCache.hunt_id);
    }

    // Fusionner avec les données existantes et valider
    const mergedData = { ...existingCache, ...req.body };
    const validatedData = await validateAndTransformCacheData(mergedData, true);

    console.log("[CACHE API] Données de mise à jour validées");

    // Mettre à jour dans la base de données
    const [updatedCache] = await db("caches")
      .where("id", id)
      .update(validatedData)
      .returning("*");

    if (!updatedCache) {
      throw new Error("Échec de la mise à jour de l'étape");
    }

    console.log("[CACHE API] Étape mise à jour avec succès");

    // Formater pour le frontend
    const formattedCache = formatCacheForFrontend(updatedCache);

    return res.status(200).json({
      success: true,
      message: "Étape modifiée avec succès",
      data: formattedCache,
    });
  } catch (error) {
    console.error("[CACHE API] Erreur PUT:", error);

    if (error.message.includes("Erreur de validation")) {
      return res.status(400).json({
        error: "Données invalides",
        message: error.message,
        code: "VALIDATION_ERROR",
      });
    }

    throw error;
  }
}

// Handler DELETE - Supprimer une étape
async function handleDeleteCache(req, res) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({
        error: "ID requis",
        message: "Veuillez spécifier l'ID de l'étape à supprimer",
      });
    }

    console.log(`[CACHE API] Suppression de l'étape ID: ${id}`);

    // Vérifier que l'étape existe
    const existingCache = await db("caches").where("id", id).first();

    if (!existingCache) {
      return res.status(404).json({
        error: "Étape introuvable",
        id: id,
      });
    }

    // Supprimer l'étape
    const [deletedCache] = await db("caches")
      .where("id", id)
      .del()
      .returning("*");

    if (!deletedCache) {
      throw new Error("Échec de la suppression de l'étape");
    }

    // Réorganiser les index des autres étapes de la même chasse
    if (deletedCache.hunt_id) {
      await db("caches")
        .where("hunt_id", deletedCache.hunt_id)
        .where("order_index", ">", deletedCache.order_index)
        .decrement("order_index", 1);
    }

    console.log("[CACHE API] Étape supprimée avec succès");

    return res.status(200).json({
      success: true,
      message: "Étape supprimée avec succès",
      data: formatCacheForFrontend(deletedCache),
    });
  } catch (error) {
    console.error("[CACHE API] Erreur DELETE:", error);
    throw error;
  }
}

// Fonction utilitaire pour dupliquer une étape
export async function duplicateCache(cacheId, newHuntId = null) {
  try {
    const originalCache = await db("caches").where("id", cacheId).first();

    if (!originalCache) {
      throw new Error("Étape à dupliquer introuvable");
    }

    const duplicateData = { ...originalCache };
    delete duplicateData.id;
    delete duplicateData.created_at;
    delete duplicateData.updated_at;

    if (newHuntId) {
      duplicateData.hunt_id = newHuntId;
    }

    duplicateData.title = `${duplicateData.title} (Copie)`;
    duplicateData.created_at = new Date();
    duplicateData.updated_at = new Date();

    // Définir le nouvel ordre
    const maxOrder = await db("caches")
      .where("hunt_id", duplicateData.hunt_id)
      .max("order_index as max")
      .first();

    duplicateData.order_index = (maxOrder?.max || -1) + 1;

    const [newCache] = await db("caches").insert(duplicateData).returning("*");

    return formatCacheForFrontend(newCache);
  } catch (error) {
    console.error("Erreur lors de la duplication:", error);
    throw error;
  }
}

// Exporter les fonctions utilitaires
export {
  validateAndTransformCacheData,
  formatCacheForFrontend,
  updateCacheOrder,
  getCacheTypeLabel,
  getCacheStatusLabel,
  getDifficultyLabel,
};
