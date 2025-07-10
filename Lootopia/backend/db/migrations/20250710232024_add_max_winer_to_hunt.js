/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("hunts", (table) => {
    table.integer("max_winner");
    table.decimal("winner_price", 10, 2);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("hunts", (table) => {
    table.dropColumn("max_winner");
    table.dropColumn("winner_price");
  });
};
