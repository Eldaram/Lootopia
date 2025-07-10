exports.seed = async function (knex) {
  // On supprime dans l'ordre pour gérer les contraintes FK
  await knex("user_offers").del();
  await knex("user_other_rewards").del();
  await knex("user_artifacts").del();
  await knex("user_badges").del();
  await knex("transactions").del();
  await knex("badges").del();
  await knex("offers").del();
  await knex("other_rewards").del();
  await knex("caches").del();
  await knex("hunt_artifacts").del();
  await knex("artifacts").del();
  await knex("collections").del();
  await knex("themes").del();
  await knex("hunts").del();
  await knex("maps").del();
  await knex("partner_colors").del();
  await knex("users").del();

  // Insertion des users
  await knex("users").insert([
    {
      id: 1,
      email: "alice@example.com",
      username: "alice",
      password: "hashed_password", // à remplacer par un vrai hash en prod
      role: "admin",
      phone: 1234567890,
      status: 0,
    },
    {
      id: 2,
      email: "bob@example.com",
      username: "bob",
      password: "hashed_password",
      role: "user",
      phone: 9876543210,
      status: 0,
    },
  ]);

  // Insertion des maps
  await knex("maps").insert([
    {
      id: 1,
      name: "Map Centrale",
      skin: 1,
      zone: "Zone A",
      scale: "1:1000",
      partner_id: 1,
      status: 1,
    },
  ]);

  // Insertion des hunts
  await knex("hunts").insert([
    {
      id: 1,
      title: "Chasse au trésor Paris",
      description: "Une super chasse à Paris",
      world: 1,
      duration: new Date(Date.now() + 3600 * 1000), // 1h plus tard
      mode: 1,
      max_participants: 10,
      chat_enabled: true,
      map_id: 1,
      participation_fee: 10,
      partner_id: 1,
      status: 1,
    },
  ]);

  // Insertion des caches avec la colonne location (PostGIS)
  await knex("caches").insert([
    {
      id: 1,
      visibility: 1,
      partner_id: 1,
      status: 1,
      created_at: new Date(),
      location: knex.raw("ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)"), // Paris (lon, lat)
    },
    {
      id: 2,
      visibility: 1,
      partner_id: 2,
      status: 1,
      created_at: new Date(),
      location: knex.raw("ST_SetSRID(ST_MakePoint(4.8357, 45.7640), 4326)"), // Lyon
    },
  ]);

  // Exemple d’insertion dans badges
  await knex("badges").insert([
    {
      id: 1,
      name: "Badge Expert",
      type: 1,
      collections_id: null,
      admin_id: 1,
      status: 1,
    },
  ]);

  // Exemple d’insertion dans collections
  await knex("collections").insert([
    {
      id: 1,
      name: "Collection A",
      type: 1,
      admin_id: 1,
      status: 1,
    },
  ]);

  // Exemple d’insertion dans artifacts
  await knex("artifacts").insert([
    {
      id: 1,
      type: 1,
      theme_id: null,
      rarity: 3,
      illustration_id: null,
      collection_id: 1,
      usage: 0,
      admin_id: 1,
      status: 1,
    },
  ]);
};
