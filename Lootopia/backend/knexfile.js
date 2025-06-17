require("dotenv").config({ path: "./.env.local" });

module.exports = {
  development: {
    client: "pg",
    debug: true,
    connection: process.env.DB__CONNECTION,
    migrations: {
      directory: "./db/migrations",
      stub: "./db/migration.stub",
      loadExtensions: [".js"],
    },
    seeds: {
      directory: "./db/seeds",
      stub: "./db/seed.stub",
      loadExtensions: [".js"],
    },
  },
};
