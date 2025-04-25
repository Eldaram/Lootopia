# Lootopia - Expo App with PostgreSQL/PostGIS

This project is an [Expo](https://expo.dev) application with geospatial database capabilities using PostgreSQL and PostGIS.

## 📱 Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL with PostGIS extension (for database features)
- Android Studio (for Android development)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up your database (see Database Setup section)

3. Start the app
   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## 🗄️ Database (DB) Setup

### Prerequisites

- PostgreSQL installed locally (version 17 recommended)
- PostGIS extension for geospatial data
- Node.js with Knex.js for migrations and seeds

### Installing PostgreSQL & PostGIS

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Install PostGIS extension:
   - On Windows: Use PostgreSQL's StackBuilder tool
   - Open StackBuilder and select PostGIS for your PostgreSQL version
3. Enable PostGIS in your database:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### Environment Configuration

Create a `.env.local` file at your project root:

```
DB__CONNECTION=postgres://postgres:root@localhost:5050/lootopia
```

Connection string format:

- `postgres://` — protocol
- `postgres` — database user
- `root` — password
- `localhost` — host
- `5050` — port (adjust if needed)
- `lootopia` — database name

### Knex Configuration

Create `knexfile.js` (or `.ts`):

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

### Database Commands

#### Migrations

```bash
# Create a migration
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest
```

Example migration for geospatial data:

```javascript
table.specificType("location", "geometry(Point, 4326)");
table.float("dimension"); // Radius in kilometers around the point
```

#### Seeds

```bash
# Create a seed file
npx knex seed:make seed_name

# Run seeds
npx knex seed:run
```

Example geospatial data insertion:

```javascript
await knex("caches").insert({
  location: knex.raw(`ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)`), // Paris
  dimension: 10, // Radius in kilometers
  visibility: 1,
  partner_id: 1,
  status: 1,
});
```

### Verify Database Connection

Test your connection with this script:

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

### Recommended Database Tools

- **TablePlus**: Modern, user-friendly UI
- **PgAdmin**: Official PostgreSQL tool

## 📱 Android Emulator Setup

### 1. Install Android Studio

1. Download from https://developer.android.com/studio
2. Install with recommended options
3. Let Android Studio install the SDK and necessary tools

### 2. Set Environment Variables (Windows)

1. Create system variable:
   - **Name**: `ANDROID_HOME`
   - **Value**: `C:\Users\<YourName>\AppData\Local\Android\Sdk`
2. Add to `Path`:
   ```
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\platform-tools
   ```

### 3. Enable Virtualization

1. Restart your PC and enter BIOS (usually `DEL`, `F2`, or `ESC`)
2. Enable:
   - `SVM Mode` (AMD) or
   - `Intel VT-x` (Intel)
3. Save and restart

### 4. Disable Hyper-V (Windows)

Run PowerShell as admin:

```powershell
bcdedit /set hypervisorlaunchtype off
```

Then restart your computer.

### 5. Create Android Emulator

1. In Android Studio, go to **Tools > Device Manager**
2. Click **Create Device**
3. Choose **Pixel 6a**
4. Select a system image with **Google Play** (Android 13 recommended)
5. Click **Finish**

### 6. Launch Project in Emulator

1. Start the emulator via Android Studio (Device Manager > ▶️)
2. In your project terminal, run:
   ```bash
   npx expo start --android
   ```

## 🔄 Reset Project (for new development)

When you're ready to start fresh:

```bash
npm run reset-project
```

This moves starter code to the **app-example** directory and creates a blank **app** directory.

## 📚 Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## 🤝 Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
