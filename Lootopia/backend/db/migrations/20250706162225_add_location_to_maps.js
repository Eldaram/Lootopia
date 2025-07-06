/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("maps", function (table) {
    table
      .specificType("location", "geometry(Point, 4326)")
      .nullable()
      .comment("Coordonnées géographiques (longitude/latitude)");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("maps", function (table) {
    table.dropColumn("location");
  });
};
