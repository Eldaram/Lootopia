exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email", 255).unique();
    table.string("username", 100);
    table.string("password", 255);
    table.string("role", 50);
    table.bigInteger("phone");
    table.string("social_login_id", 255);
    table.string("provider", 100);
    table.smallint("notification_pref");
    table.integer("profile_photo_id");
    table.integer("avatar_id");
    table.integer("logo_id");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("maps", (table) => {
    table.increments("id").primary();
    table.string("name", 255);
    table.integer("skin");
    table.string("zone", 255);
    table.string("scale", 100);
    table.integer("partner_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("hunts", (table) => {
    table.increments("id").primary();
    table.string("title", 255);
    table.text("description");
    table.smallint("world");
    table.timestamp("duration");
    table.smallint("mode");
    table.integer("max_participants");
    table.boolean("chat_enabled");
    table.integer("map_id").references("id").inTable("maps");
    table.integer("participation_fee");
    table.time("search_delay").defaultTo(knex.raw(`INTERVAL '1 minute'`));
    table.integer("partner_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("themes", (table) => {
    table.increments("id").primary();
    // Ajoute ici d'autres colonnes si nécessaire
  });

  await knex.schema.createTable("collections", (table) => {
    table.increments("id").primary();
    table.string("name", 255);
    table.smallint("type");
    table.integer("admin_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("artifacts", (table) => {
    table.increments("id").primary();
    table.smallint("type");
    table.integer("theme_id").references("id").inTable("themes");
    table.smallint("rarity");
    table.integer("illustration_id");
    table.integer("collection_id").references("id").inTable("collections");
    table.integer("usage");
    table.integer("admin_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("hunt_artifacts", (table) => {
    table.increments("id").primary();
    table.integer("hunt_id").references("id").inTable("hunts");
    table.integer("artifact_id").references("id").inTable("artifacts");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("caches", (table) => {
    table.increments("id").primary();
    table.string("dimensions", 100);
    table.integer("coordinates");
    table.smallint("visibility");
    table.integer("partner_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("badges", (table) => {
    table.increments("id").primary();
    table.string("name", 255);
    table.smallint("type");
    table.integer("illustration_id");
    table.integer("collections_id").references("id").inTable("collections");
    table.integer("admin_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("sender_id").references("id").inTable("users");
    table.integer("receiver_id").references("id").inTable("users");
    table.smallint("type");
    table.decimal("amount", 10, 2);
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("other_rewards", (table) => {
    table.increments("id").primary();
    table.smallint("type");
    table.string("title", 255);
    table.string("description", 500);
    table.integer("partner_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("lifetime");
    table.time("disabled_time");
    table.timestamp("disabled_start");
  });

  await knex.schema.createTable("offers", (table) => {
    table.increments("id").primary();
    table.smallint("type");
    table.string("title", 255);
    table.string("description", 500);
    table.integer("admin_id").references("id").inTable("users");
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
    table.time("lifetime");
  });

  await knex.schema.createTable("user_badges", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("badge_id").references("id").inTable("badges");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("user_artifacts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("artifact_id").references("id").inTable("artifacts");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("user_other_rewards", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("other_reward_id").references("id").inTable("other_rewards");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("user_offers", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("offer_id").references("id").inTable("offers");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });

  await knex.schema.createTable("partner_colors", (table) => {
    table.increments("id").primary();
    table.integer("partner_id").references("id").inTable("users");
    table.string("hex_color", 7);
    table.smallint("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");
  });
};

exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists("partner_colors")
    .dropTableIfExists("user_offers")
    .dropTableIfExists("user_other_rewards")
    .dropTableIfExists("user_artifacts")
    .dropTableIfExists("user_badges")
    .dropTableIfExists("offers")
    .dropTableIfExists("other_rewards")
    .dropTableIfExists("transactions")
    .dropTableIfExists("badges")
    .dropTableIfExists("caches")
    .dropTableIfExists("hunt_artifacts")
    .dropTableIfExists("artifacts")
    .dropTableIfExists("collections")
    .dropTableIfExists("themes")
    .dropTableIfExists("hunts")
    .dropTableIfExists("maps")
    .dropTableIfExists("users");
};
