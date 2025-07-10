/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("maps", function (table) {
    table
      .text("description")
      .defaultTo("")
      .comment("Description optionnelle de la carte");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("maps", function (table) {
    table.dropColumn("description");
  });
};
