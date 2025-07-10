exports.up = async function (knex) {
  await knex.schema.table("users", (table) => {
    table.timestamp("disabled_end");
  });
};

exports.down = async function (knex) {
  await knex.schema.table("users", (table) => {
    table.dropColumn("disabled_end");
  });
};
