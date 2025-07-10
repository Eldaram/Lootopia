// api/hunts.js - Version complète et optimisée

import * as Yup from "yup";
import db from "../../services/db.js";

// Schéma Yup complet pour validation des données
const huntSchema = Yup.object({
  title: Yup.string()
    .required("Le titre est requis")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .trim(),

  description: Yup.string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .nullable()
    .default(""),

  world: Yup.number()
    .integer()
    .min(1, "Le monde doit être 1 (VR) ou 2 (Carte)")
    .max(2, "Le monde doit être 1 (VR) ou 2 (Carte)")
    .default(1),

  duration: Yup.date()
    .min(new Date(), "La date de fin doit être dans le futur")
    .required("La durée est requise"),

  mode: Yup.number()
    .integer()
    .min(0, "Le mode doit être 1 (Public) ou 0 (Privé)")
    .max(2, "Le mode doit être 1 (Public) ou 0 (Privé)")
    .default(1),

  max_participants: Yup.number()
    .integer()
    .min(1, "Le nombre de participants doit être d'au moins 1")
    .max(999999, "Nombre de participants trop élevé")
    .default(10),

  chat_enabled: Yup.boolean().default(true),

  map_id: Yup.number()
    .integer()
    .min(1, "L'ID de la carte doit être valide")
    .required("Une carte doit être sélectionnée"),

  participation_fee: Yup.number()
    .min(0, "Les frais de participation ne peuvent pas être négatifs")
    .max(9999.99, "Les frais de participation sont trop élevés")
    .default(0),

  search_delay: Yup.string()
    .matches(
      /^\d{2}:\d{2}:\d{2}$/,
      "Le délai de recherche doit être au format HH:MM:SS"
    )
    .default("00:01:00"),

  partner_id: Yup.number()
    .integer()
    .min(1, "L'ID du partenaire doit être valide")
    .required("Le créateur est requis"),

  status: Yup.number()
    .integer()
    .min(0, "Le statut doit être valide")
    .max(3, "Le statut doit être valide")
    .default(1), // 0: brouillon, 1: actif, 2: suspendu, 3: terminé

  closed_at: Yup.date().nullable(),
  code_secret: Yup.string()
    .max(255, "Le code secret ne peut pas dépasser 255 caractères")
    .nullable(),

  max_winner: Yup.number()
    .integer()
    .min(1, "Le nombre maximum de gagnants doit être d'au moins 1")
    .max(9999, "Le nombre maximum de gagnants est trop élevé")
    .nullable()
    .default(null),

  winner_price: Yup.number()
    .min(0, "Le prix du gagnant ne peut pas être négatif")
    .max(999999.99, "Le prix du gagnant est trop élevé")
    .nullable()
    .default(null),
});

const huntCreateSchema = huntSchema; // inchangé

const huntUpdateSchema = Yup.object({
  title: Yup.string().min(3).max(100).trim(),
  description: Yup.string().max(500),
  world: Yup.number().integer().min(1).max(2),
  duration: Yup.date().min(new Date()),
  mode: Yup.number().integer().min(0).max(2),
  max_participants: Yup.number().integer().min(1).max(999999),
  chat_enabled: Yup.boolean(),
  map_id: Yup.number().integer().min(1),
  participation_fee: Yup.number().min(0).max(9999.99),
  search_delay: Yup.string().matches(/^\d{2}:\d{2}:\d{2}$/),
  partner_id: Yup.number().integer().min(1),
  status: Yup.number().integer().min(0).max(4),
  closed_at: Yup.date().nullable(),
  code_secret: Yup.string().max(255).nullable(),
  max_winner: Yup.number()
    .integer()
    .min(1, "Le nombre maximum de gagnants doit être d'au moins 1")
    .max(9999, "Le nombre maximum de gagnants est trop élevé")
    .nullable()
    .default(null),

  winner_price: Yup.number()
    .min(0, "Le prix du gagnant ne peut pas être négatif")
    .max(999999.99, "Le prix du gagnant est trop élevé")
    .nullable()
    .default(null),
});

// Parse la durée depuis frontend vers Date (durée fin)
function parseDurationFromFrontend(duration, durationUnit) {
  if (duration <= 0 && durationUnit !== "infini") {
    return new Date();
  }

  const now = new Date();
  let milliseconds = 0;

  switch (durationUnit) {
    case "heure":
      milliseconds = duration * 60 * 60 * 1000;
      break;
    case "semaine":
      milliseconds = duration * 7 * 24 * 60 * 60 * 1000;
      break;
    case "mois":
      milliseconds = duration * 30 * 24 * 60 * 60 * 1000;
      break;
    case "annee":
      milliseconds = duration * 365 * 24 * 60 * 60 * 1000;
      break;
    case "infini":
      return new Date(2099, 11, 31);
    default:
      milliseconds = duration * 60 * 60 * 1000;
  }

  return new Date(now.getTime() + milliseconds);
}

// Parse délai de recherche depuis frontend en format HH:MM:SS
function parseSearchDelayFromFrontend(delay, unit) {
  delay = Number(delay);
  if (isNaN(delay) || delay < 0) delay = 60;

  let totalSeconds = 0;
  switch (unit) {
    case "secondes":
      totalSeconds = delay;
      break;
    case "minutes":
      totalSeconds = delay * 60;
      break;
    case "heures":
      totalSeconds = delay * 3600;
      break;
    default:
      totalSeconds = delay * 60;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Convertir durée en front (nombre + unité)
function convertDurationForFrontend(endDate) {
  const now = new Date();
  const diffMs = new Date(endDate).getTime() - now.getTime();

  if (diffMs <= 0) {
    return { duration: 0, durationUnit: "heure" };
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffWeeks = diffMs / (1000 * 60 * 60 * 24 * 7);
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365);

  if (new Date(endDate).getFullYear() >= 2099) {
    return { duration: 1, durationUnit: "infini" };
  }

  if (diffYears >= 1) {
    return { duration: Math.round(diffYears), durationUnit: "annee" };
  } else if (diffMonths >= 1) {
    return { duration: Math.round(diffMonths), durationUnit: "mois" };
  } else if (diffWeeks >= 1) {
    return { duration: Math.round(diffWeeks), durationUnit: "semaine" };
  } else {
    return { duration: Math.round(diffHours), durationUnit: "heure" };
  }
}

// Convertir délai de recherche au format frontend (valeur + unité)
function convertSearchDelayForFrontend(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds >= 3600) {
    return {
      search_delay: Math.round(totalSeconds / 3600),
      search_delay_unit: "heures",
    };
  } else if (totalSeconds >= 60) {
    return {
      search_delay: Math.round(totalSeconds / 60),
      search_delay_unit: "minutes",
    };
  } else {
    return { search_delay: totalSeconds, search_delay_unit: "secondes" };
  }
}

// Validation + transformation des données
async function validateAndTransformData(data, isUpdate = false) {
  try {
    const transformedData = { ...data };

    // Transformer la durée
    if (
      data.duration &&
      typeof data.duration === "number" &&
      data.durationUnit
    ) {
      transformedData.duration = parseDurationFromFrontend(
        data.duration,
        data.durationUnit
      );
      delete transformedData.durationUnit;
    }

    // Transformer le délai de recherche
    if (
      data.search_delay &&
      typeof data.search_delay === "number" &&
      data.search_delay_unit
    ) {
      transformedData.search_delay = parseSearchDelayFromFrontend(
        data.search_delay,
        data.search_delay_unit
      );
      delete transformedData.search_delay_unit;
    }

    const schema = isUpdate ? huntUpdateSchema : huntCreateSchema;

    const validatedData = await schema.validate(transformedData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (!isUpdate) {
      validatedData.created_at = new Date();
    }
    validatedData.updated_at = new Date();

    return validatedData;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Validation échouée :\n- ${error.errors.join("\n- ")}`);
    }
    throw error;
  }
}

// Formater pour frontend (durée, labels, stats...)
function formatForFrontend(hunt) {
  const formatted = { ...hunt };

  const durationInfo = convertDurationForFrontend(hunt.duration);
  formatted.duration = durationInfo.duration;
  formatted.durationUnit = durationInfo.durationUnit;

  const searchDelayInfo = convertSearchDelayForFrontend(hunt.search_delay);
  formatted.search_delay = searchDelayInfo.search_delay;
  formatted.search_delay_unit = searchDelayInfo.search_delay_unit;

  formatted.status_label = getStatusLabel(hunt.status);
  formatted.world_label = hunt.world === 1 ? "VR" : "Carte";
  formatted.mode_label = hunt.mode === 1 ? "Public" : "Privé";
  formatted.is_active = hunt.status === 1;
  formatted.is_expired = new Date(hunt.duration) < new Date();
  formatted.closed_at = hunt.closed_at || null;

  formatted.code_secret = hunt.code_secret || null;

  formatted.max_winner = hunt.max_winner;
  formatted.winner_price = hunt.winner_price;


  return formatted;
}

// Libellés de statut
function getStatusLabel(status) {
  const statusLabels = {
    0: "Brouillon",
    1: "Active",
    2: "Suspendue",
    3: "Terminée",
  };
  return statusLabels[status] || "Inconnu";
}

// Récupérer les stats d'une chasse
async function getHuntStats(huntId) {
  const stats = await db("hunt_player")
    .where("hunt_id", huntId)
    .count("id as player_count")
    .first();

  return {
    player_count: stats.player_count || 0,
  };
}

// Handlers API

// GET /api/hunts?id=xx&partner_id=xx&status=xx&world=xx&mode=xx&include_stats=1
async function handleGet(req, res) {
  const { id, partner_id, status, world, mode, include_stats } = req.query;

  let query = db("hunts").select("*");

  if (id) query = query.where("id", id);
  if (partner_id) query = query.where("partner_id", partner_id);
  if (status) query = query.where("status", status);
  if (world) query = query.where("world", world);
  if (mode) query = query.where("mode", mode);

  const hunts = await query.orderBy("id", "desc");

  if (hunts.length === 0) {
    return res.status(404).json({ error: "Aucune chasse trouvée" });
  }

  // Inclure stats si demandé
  if (include_stats === "1") {
    for (let hunt of hunts) {
      hunt.stats = await getHuntStats(hunt.id);
    }
  }

  const formattedHunts = hunts.map(formatForFrontend);

  res.status(200).json(formattedHunts);
}

// POST /api/hunts
async function handlePost(req, res) {
  const data = req.body;

  const validatedData = await validateAndTransformData(data);

  const [inserted] = await db("hunts").insert(validatedData).returning("id");
  res.status(201).json({ id: inserted.id }); // ✅ on extrait bien le vrai id
}

// PUT /api/hunts?id=xx
async function handlePut(req, res) {
  const { id } = req.query;
  if (!id)
    return res.status(400).json({ error: "ID est requis pour la mise à jour" });

  const data = req.body;

  const validatedData = await validateAndTransformData(data, true);

  // Clôture automatique : si status = 4 et closed_at non fourni, on force la date
  if (validatedData.status === 4 && !validatedData.closed_at) {
    validatedData.closed_at = new Date();
  }

  await db("hunts").where("id", id).update(validatedData);

  const updatedHunt = await db("hunts").where("id", id).first();

  res.status(200).json(formatForFrontend(updatedHunt));
}

// DELETE /api/hunts?id=xx
async function handleDelete(req, res) {
  const { id } = req.query;
  if (!id)
    return res.status(400).json({ error: "ID est requis pour suppression" });

  const deletedCount = await db("hunts").where("id", id).del();

  if (deletedCount === 0) {
    return res.status(404).json({ error: "Chasse introuvable" });
  }

  res.status(204).end();
}

// Export du handler Next.js API route
export default async function handler(req, res) {
  // CORS simple (adapter selon besoin)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
        return res
          .status(405)
          .json({ error: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error("[HUNT API] Error:", error);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ error: "Base de données indisponible" });
    }

    if (error.code === "23505") {
      return res.status(409).json({ error: "Titre déjà utilisé" });
    }

    return res
      .status(500)
      .json({ error: "Erreur interne serveur", message: error.message });
  }
}
