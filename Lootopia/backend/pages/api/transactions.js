import db from "../../services/db.js";
import * as Yup from "yup";

// Schéma de validation pour les transactions
const transactionSchema = Yup.object({
  sender_id: Yup.number().required("L'identifiant de l'expéditeur est requis"),
  receiver_id: Yup.number().required(
    "L'identifiant du destinataire est requis"
  ),
  type: Yup.number().required("Le type de transaction est requis"),
  amount: Yup.number().required("Le montant est requis"),
  status: Yup.number().default(1),
});

// Validation des données
async function validateData(data) {
  try {
    return await transactionSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(", "));
  }
}

export default async function handler(req, res) {
  try {
    // Méthode GET : Récupère toutes les transactions ou une transaction spécifique
    if (req.method === "GET") {
      const { id, user_id } = req.query;

      if (id) {
        const transaction = await db("transactions").where("id", id).first();
        if (!transaction) {
          return res.status(404).json({ error: "Transaction introuvable" });
        }
        return res.status(200).json(transaction);
      } else if (user_id) {
        // Récupérer toutes les transactions impliquant un utilisateur spécifique
        const transactions = await db("transactions")
          .where("sender_id", user_id)
          .orWhere("receiver_id", user_id);
        return res.status(200).json(transactions);
      } else {
        const transactions = await db("transactions");
        return res.status(200).json(transactions);
      }
    }

    // Méthode POST : Ajoute une nouvelle transaction
    if (req.method === "POST") {
      // Vérifier si sender_id existe
      const senderExists = await db("users")
        .where("id", req.body.sender_id)
        .first();
      if (!senderExists) {
        return res
          .status(404)
          .json({ error: "L'expéditeur spécifié n'existe pas" });
      }

      // Vérifier si receiver_id existe
      const receiverExists = await db("users")
        .where("id", req.body.receiver_id)
        .first();
      if (!receiverExists) {
        return res
          .status(404)
          .json({ error: "Le destinataire spécifié n'existe pas" });
      }

      // Vérifier que l'expéditeur n'est pas le destinataire
      if (req.body.sender_id === req.body.receiver_id) {
        return res
          .status(400)
          .json({
            error:
              "L'expéditeur et le destinataire ne peuvent pas être identiques",
          });
      }

      // Valider les données
      const validatedData = await validateData(req.body);
      validatedData.created_at = new Date();

      try {
        // Insérer dans la base de données
        const [newTransaction] = await db("transactions")
          .insert(validatedData)
          .returning([
            "id",
            "sender_id",
            "receiver_id",
            "type",
            "amount",
            "status",
            "created_at",
            "updated_at",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(201).json(newTransaction);
      } catch (error) {
        console.error("Erreur d'insertion:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Une des références (sender_id, receiver_id) n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la création: ${error.message}` });
      }
    }

    // Méthode PUT : Met à jour une transaction existante
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Récupérer l'entrée existante
      const existingTransaction = await db("transactions")
        .where("id", id)
        .first();
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transaction introuvable" });
      }

      // Vérifier si sender_id existe (si fourni)
      if (
        req.body.sender_id &&
        req.body.sender_id !== existingTransaction.sender_id
      ) {
        const senderExists = await db("users")
          .where("id", req.body.sender_id)
          .first();
        if (!senderExists) {
          return res
            .status(404)
            .json({ error: "L'expéditeur spécifié n'existe pas" });
        }
      }

      // Vérifier si receiver_id existe (si fourni)
      if (
        req.body.receiver_id &&
        req.body.receiver_id !== existingTransaction.receiver_id
      ) {
        const receiverExists = await db("users")
          .where("id", req.body.receiver_id)
          .first();
        if (!receiverExists) {
          return res
            .status(404)
            .json({ error: "Le destinataire spécifié n'existe pas" });
        }
      }

      // Vérifier que l'expéditeur n'est pas le destinataire
      if (
        req.body.sender_id &&
        req.body.receiver_id &&
        req.body.sender_id === req.body.receiver_id
      ) {
        return res
          .status(400)
          .json({
            error:
              "L'expéditeur et le destinataire ne peuvent pas être identiques",
          });
      }

      // Préparer les données à mettre à jour
      const dataToUpdate = {
        ...req.body,
        updated_at: new Date(),
      };

      try {
        // Mettre à jour la transaction
        const [updatedTransaction] = await db("transactions")
          .where("id", id)
          .update(dataToUpdate)
          .returning([
            "id",
            "sender_id",
            "receiver_id",
            "type",
            "amount",
            "status",
            "created_at",
            "updated_at",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(200).json(updatedTransaction);
      } catch (error) {
        console.error("Erreur de mise à jour:", error);

        if (error.message.includes("foreign key constraint")) {
          return res.status(409).json({
            error: "Une des références (sender_id, receiver_id) n'existe pas",
          });
        }

        return res
          .status(500)
          .json({ error: `Erreur lors de la mise à jour: ${error.message}` });
      }
    }

    // Méthode DELETE : Supprime une transaction par ID
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      // Vérifier si la transaction existe
      const transactionExists = await db("transactions")
        .where("id", id)
        .first();
      if (!transactionExists) {
        return res.status(404).json({ error: "Transaction introuvable" });
      }

      try {
        // Supprimer la transaction
        const [deletedTransaction] = await db("transactions")
          .where("id", id)
          .del()
          .returning([
            "id",
            "sender_id",
            "receiver_id",
            "type",
            "amount",
            "status",
            "created_at",
            "updated_at",
            "disabled_time",
            "disabled_start",
          ]);

        return res.status(200).json(deletedTransaction);
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
