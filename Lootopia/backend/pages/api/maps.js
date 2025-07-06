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
  description: Yup.string().default(""),
  latitude: Yup.number().optional(),
  longitude: Yup.number().optional(),
  radius: Yup.number().optional(),
});

// Validation des données et application des valeurs par défaut
async function validateAndApplyDefaults(data) {
  try {
    const validatedData = await mapSchema.validate(data, {
      abortEarly: false,
      stripUnknown: false,
    });

    if (!data.id) {
      validatedData.created_at = new Date();
    }

    return validatedData;
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const { id, partner_id } = req.query;

      if (id) {
        const map = await db("maps")
          .select("*", db.raw("ST_AsGeoJSON(location) as location_geojson"))
          .where("id", id)
          .first();

        if (!map) return res.status(404).json({ error: "Map introuvable" });

        if (map.location_geojson) {
          map.location = JSON.parse(map.location_geojson);
          delete map.location_geojson;
        }

        return res.status(200).json(map);
      }

      let mapsQuery = db("maps").select(
        "*",
        db.raw("ST_AsGeoJSON(location) as location_geojson")
      );

      if (partner_id) {
        mapsQuery = mapsQuery.where("partner_id", partner_id);
      }

      const maps = await mapsQuery;

      const enrichedMaps = maps.map((map) => {
        if (map.location_geojson) {
          map.location = JSON.parse(map.location_geojson);
          delete map.location_geojson;
        }
        return map;
      });

      return res.status(200).json(enrichedMaps);
    }

    if (req.method === "POST") {
      const validatedData = await validateAndApplyDefaults(req.body);

      const { latitude, longitude, radius, ...dataToInsert } = validatedData;

      if (latitude && longitude) {
        dataToInsert.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)`, [
          longitude,
          latitude,
        ]);
      }

      const [newMap] = await db("maps").insert(dataToInsert).returning("*");
      return res.status(201).json(newMap);
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID requis" });

      const existingMap = await db("maps").where("id", id).first();
      if (!existingMap)
        return res.status(404).json({ error: "Map introuvable" });

      const mergedData = { ...existingMap, ...req.body };
      const validatedData = await validateAndApplyDefaults(mergedData);

      const { latitude, longitude, radius, ...dataToUpdate } = validatedData;

      dataToUpdate.updated_at = new Date();

      if (latitude && longitude) {
        dataToUpdate.location = db.raw(`ST_SetSRID(ST_MakePoint(?, ?), 4326)`, [
          longitude,
          latitude,
        ]);
      }

      const [updatedMap] = await db("maps")
        .where("id", id)
        .update(dataToUpdate)
        .returning("*");

      return res.status(200).json(updatedMap);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID requis" });

      const mapExists = await db("maps").where("id", id).first();
      if (!mapExists) return res.status(404).json({ error: "Map introuvable" });

      const huntsUsingMap = await db("hunts").where("map_id", id).first();
      if (huntsUsingMap) {
        return res.status(409).json({
          error:
            "Cette map ne peut pas être supprimée car elle est utilisée dans des chasses au trésor",
        });
      }

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
