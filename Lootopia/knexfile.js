const { config } = require("dotenv");

config({ path: ".env.local" });

module.exports = {
  development: {
    client: "pg",
    debug: true,
    connection: process.env.DB__CONNECTION,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
