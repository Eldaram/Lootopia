# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Database (DB) Setup

### Prerequisites

- PostgreSQL installed locally (e.g., version 17)
- **PostGIS** extension installed on PostgreSQL (required for geospatial data)
- Node.js with **Knex.js** to manage migrations and seeds

### Installing and Configuring PostgreSQL with PostGIS

1. Install PostgreSQL (if not already done): https://www.postgresql.org/download/windows/
2. Install PostGIS extension:
   - On Windows, PostGIS is usually available via PostgreSQL's StackBuilder tool.
   - Open StackBuilder and select PostGIS for your PostgreSQL version.
3. Enable the PostGIS extension in your database: Connect to your database (using psql, PgAdmin, or another client) and run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Environment Variable Configuration (`.env.local`)

Create a `.env.local` file at your project root and add your PostgreSQL connection string, for example:

```
DB__CONNECTION=postgres://postgres:root@localhost:5050/lootopia
```

- `postgres://` — protocol
- `postgres` — database user
- `root` — password
- `localhost` — host
- `5050` — port (adjust if needed)
- `lootopia` — database name

### Knex Configuration

Your `knexfile.js` (or `.ts`) should load this environment variable to connect to the database:

```javascript
import { config } from "dotenv";
config({ path: ".env.local" });

const knexfile = {
  client: "pg",
  connection: process.env.DB__CONNECTION,
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
  debug: true,
};

export default knexfile;
```

### Managing Migrations

- Migration files are stored in `/db/migrations`
- Create a new migration:

```bash
npx knex migrate:make migration_name
```

- Run migrations to update your database schema:

```bash
npx knex migrate:latest
```

- Example migration for geospatial data in `caches` table:

```javascript
table.specificType("location", "geometry(Point, 4326)");
table.float("dimension"); // Radius in kilometers around the point
```

### Managing Seeds

- Seed files are stored in `/db/seeds`
- Create a new seed file:

```bash
npx knex seed:make seed_name
```

- Run seeds to populate tables with initial data:

```bash
npx knex seed:run
```

- Seeds can include geospatial data using PostGIS functions.

#### Example Geospatial Data Insertion in a Seed

```javascript
await knex("caches").insert({
  location: knex.raw(`ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)`), // Longitude, Latitude (example: Paris)
  dimension: 10, // Radius in kilometers
  visibility: 1,
  partner_id: 1,
  status: 1,
});
```

### Verify Database Connection

Before running migrations or seeds, you can test the connection with this simple Node.js script:

```javascript
import knex from "knex";
import { config } from "dotenv";
config({ path: ".env.local" });

const db = knex({
  client: "pg",
  connection: process.env.DB__CONNECTION,
});

db.raw("SELECT 1+1 AS result")
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error("DB connection error:", err))
  .finally(() => db.destroy());
```

### Recommended Tools for Database Visualization

- **TablePlus** (modern, user-friendly UI)
- **PgAdmin** (official PostgreSQL tool, more traditional UI)
- Make sure connection parameters (host, port, user, password) match your PostgreSQL setup.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# ⚙️ Configuration de l'Émulateur Android avec Expo (React Native)

Ce guide permet de configurer **Android Studio** et un **émulateur Android (Pixel 6a avec Google Play)** pour exécuter un projet React Native avec **Expo**.

> 🛠 Le projet est déjà installé (`npm install` fait) et `expo` est déjà présent (`expo --version` fonctionne).

---

## 1. 📥 Installer Android Studio

1. Téléchargez Android Studio : https://developer.android.com/studio
2. Installez-le avec les options recommandées.
3. Au premier lancement, laissez Android Studio installer :
   - Le **SDK Android**
   - Le **SDK Command Line Tools**
   - Et tout ce qu’il propose par défaut

---

## 2. ⚙️ Variables d’environnement (Windows)

### A. Créer une variable système

- **Nom** : `ANDROID_HOME`
- **Valeur** :  
  `C:\Users\<VotreNom>\AppData\Local\Android\Sdk`

> Remplace `<VotreNom>` par ton nom d’utilisateur Windows.

### B. Modifier la variable `Path`

Ajoutez **ces deux chemins** à votre `Path` :

```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
```

> Ça permet à la ligne de commande d’accéder aux outils nécessaires.

---

## 3. 🧬 Activer SVM (virtualisation) dans le BIOS

1. Redémarrez votre PC.
2. Appuyez sur `DEL`, `F2`, `ESC`, etc. (selon votre carte mère) pour entrer dans le BIOS.
3. Activez :
   - `SVM Mode` (AMD)
   - ou `Intel VT-x` (Intel)
4. Sauvegardez & redémarrez.

> 💡 Cela permet à l’émulateur Android de fonctionner correctement.

---

## 4. ❌ Désactiver Hyper-V (Windows uniquement)

L’émulateur ne fonctionne pas avec Hyper-V activé.

### Via PowerShell (admin) :

```powershell
bcdedit /set hypervisorlaunchtype off
```

Redémarrez ensuite votre machine.

---

## 5. 📱 Créer un émulateur Android (Pixel 6a)

1. Dans Android Studio, allez dans **Tools > Device Manager**.
2. Cliquez sur **Create Device**.
3. Choisissez **Pixel 6a**.
4. Sélectionnez une image système avec **Google Play** (ex: Android 13).
5. Cliquez sur **Finish**.

---

## 6. 🚀 Lancer le projet dans l’émulateur

1. Démarrez l’émulateur via Android Studio (Device Manager > ▶️).
2. Dans le terminal, placez-vous dans le dossier du projet Expo.
3. Exécutez :

```bash
npm start
```

> ou directement :

```bash
expo start --android
```

Cela ouvrira l'app dans l’émulateur automatiquement ✅

---

## ✅ Prêt à coder !

Tu peux maintenant développer, tester et itérer ton app React Native directement dans un émulateur Android 👨‍💻📱  
Si tu as des soucis : vérifie que le chemin SDK est bon et que l’émulateur est bien démarré **avant** de lancer `expo`.

---

Made with ☕ by un collègue sympa ✌️
