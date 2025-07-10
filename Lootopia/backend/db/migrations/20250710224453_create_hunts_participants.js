/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("hunts_participants", (table) => {
    table.increments("id").primary();
    table
      .integer("hunt_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("hunts")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.boolean("excluded").notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.unique(["hunt_id", "user_id"]); // empêche les doublons
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("hunts_participants");
};
