/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("faq_entries", (table) => {
    table.increments("id").primary();
    table.string("question").notNullable();
    table.text("answer").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("help_requests", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("email");
    table.string("subject").notNullable();
    table.text("message").notNullable();
    table.text("response");
    table
      .integer("responded_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.boolean("is_resolved").defaultTo(false);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("faq_entries");
  await knex.schema.dropTableIfExists("help_requests");
};
