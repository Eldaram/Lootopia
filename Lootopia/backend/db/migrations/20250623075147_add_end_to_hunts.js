/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("hunts", (table) => {
    table.timestamp("closed_at").nullable();
    table.dropColumn("disabled_start");
    table.dropColumn("disabled_time");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("hunts", (table) => {
    table.dropColumn("closed_at");
    table.timestamp("disabled_start").nullable();
    table.integer("disabled_time").nullable(); // adapte le type si besoin
  });
};
