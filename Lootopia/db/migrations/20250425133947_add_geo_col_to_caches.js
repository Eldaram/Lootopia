exports.up = function (knex) {
  return knex.schema.alterTable("caches", (table) => {
    table.dropColumn("coordinates");
    table.specificType("location", "geometry(Point, 4326)").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("caches", (table) => {
    table.string("coordinates");
    table.dropColumn("location");
  });
};
