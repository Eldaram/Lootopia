module.exports = {
  up: function (knex) {
    return knex.schema.createTable("user_hunts", function (table) {
      table.increments();
      table.integer("hunt_id").references("id").inTable("hunts");
      table.integer("user_id").references("id").inTable("users");
      // table.integer("cache_id").references("id").inTable("caches");
      // table.smallint("statut");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    });
  },
  down: function (knex) {
    return knex.schema.dropTable("user_hunts");
  },
};
