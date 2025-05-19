import db from "../../services/db";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const users = await db("users").select(
        "id",
        "username",
        "email",
        "role",
        "created_at"
      );

      if (Array.isArray(users)) {
        return res.status(200).json(users);
      } else {
        return res.status(500).json({
          error: "Les utilisateurs ne sont pas sous forme de tableau",
        });
      }
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// export default async function handler(req, res) {
//   try {
//     // Méthode GET : Récupère toutes les collections ou une collection spécifique
//     if (req.method === "GET") {
//       const { id } = req.query;

//       if (id) {
//         // Récupérer une collection spécifique par ID
//         const collection = await db("collections").where("id", id).first();

//         if (!collection) {
//           return res.status(404).json({ error: "Collection introuvable" });
//         }

//         return res.status(200).json(collection);
//       } else {
//         // Récupérer toutes les collections
//         const collections = await db("collections");
//         return res.status(200).json(collections);
//       }
//     }

//     // Méthode POST : Ajoute une nouvelle collection
//     if (req.method === "POST") {
//       // Vérifier si l'admin_id existe dans la table users
//       const adminExists = await db("users").where("id", req.body.admin_id).first();
//       if (!adminExists) {
//         return res.status(404).json({ error: "L'administrateur spécifié n'existe pas" });
//       }

//       // Valider et appliquer les valeurs par défaut
//       const validatedData = await validateAndApplyDefaults(req.body, false);

//       try {
//         // Insérer dans la base de données et récupérer l'entrée complète
//         const [newCollection] = await db("collections")
//           .insert(validatedData)
//           .returning([
//             "id",
//             "name",
//             "type",
//             "admin_id",
//             "status",
//             "created_at",
//             "updated_at"
//           ]);

//         return res.status(201).json(newCollection);
//       } catch (error) {
//         // Gérer explicitement l'erreur de clé dupliquée
//         if (error.message.includes("collections_pkey") || error.message.includes("duplicate key")) {
//           console.error("Erreur de clé dupliquée:", error);
//           return res.status(409).json({
//             error: "Conflit d'ID - impossible de créer la collection"
//           });
//         }
//         throw error;
//       }
//     }

//     // Méthode PUT : Met à jour une collection existante
//     if (req.method === "PUT") {
//       const { id } = req.query;
//       if (!id) {
//         return res.status(400).json({ error: "ID requis" });
//       }

//       // Récupérer l'entrée existante
//       const existingCollection = await db("collections").where("id", id).first();
//       if (!existingCollection) {
//         return res.status(404).json({ error: "Collection introuvable" });
//       }

//       // Vérifier si le nouvel admin_id existe (si fourni)
//       if (req.body.admin_id && req.body.admin_id !== existingCollection.admin_id) {
//         const adminExists = await db("users").where("id", req.body.admin_id).first();
//         if (!adminExists) {
//           return res.status(404).json({ error: "L'administrateur spécifié n'existe pas" });
//         }
//       }

//       // Fusionner les données existantes avec les nouvelles données
//       const mergedData = { ...existingCollection, ...req.body };

//       // Valider et appliquer les valeurs par défaut (indiquer que c'est une mise à jour)
//       const validatedData = await validateAndApplyDefaults(mergedData, true);

//       // Ajouter updated_at
//       validatedData.updated_at = new Date();

//       // Mettre à jour et récupérer l'entrée complète
//       const [updatedCollection] = await db("collections")
//         .where("id", id)
//         .update(validatedData)
//         .returning([
//           "id",
//           "name",
//           "type",
//           "admin_id",
//           "status",
//           "created_at",
//           "updated_at"
//         ]);

//       return res.status(200).json(updatedCollection);
//     }

//     // Méthode DELETE : Supprime une collection par ID
//     if (req.method === "DELETE") {
//       const { id } = req.query;
//       if (!id) {
//         return res.status(400).json({ error: "ID requis" });
//       }

//       // Vérifier si la collection existe
//       const collectionExists = await db("collections").where("id", id).first();
//       if (!collectionExists) {
//         return res.status(404).json({ error: "Collection introuvable" });
//       }

//       // Supprimer la collection et retourner les données supprimées
//       const [deletedCollection] = await db("collections")
//         .where("id", id)
//         .del()
//         .returning([
//           "id",
//           "name",
//           "type",
//           "admin_id",
//           "status",
//           "created_at",
//           "updated_at"
//         ]);

//       return res.status(200).json(deletedCollection);
//     }

//     res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//     return res.status(405).end(`Méthode ${req.method} non autorisée`);
//   } catch (error) {
//     console.error("Erreur API:", error);
//     res.status(500).json({ error: `Erreur serveur: ${error.message}` });
//   }
// }
