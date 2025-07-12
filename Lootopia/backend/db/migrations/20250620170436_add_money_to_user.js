exports.up = async function (knex) {
  await knex.schema.table("users", (table) => {
    table.integer("money").defaultTo(0).notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.table("users", (table) => {
    table.integer("money");
  });
};
