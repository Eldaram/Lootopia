exports.up = async function (knex) {
  await knex.schema.createTable("appearance", (table) => {
    table.increments("id").primary();
    table.enu("mode", ["DARK", "LIGHT"]).notNullable().unique();
  });

  await knex("appearance").insert([{ mode: "DARK" }, { mode: "LIGHT" }]);

  await knex.schema.alterTable("users", (table) => {
    table
      .integer("appearance_id")
      .unsigned()
      .references("id")
      .inTable("appearance")
      .onDelete("SET NULL")
      .defaultTo(2);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("appearance_id");
  });

  await knex.schema.dropTableIfExists("appearance");
};
