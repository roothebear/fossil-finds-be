const db = require("../connection");

const createTables = async () => {
  const typesTablePromise = db.query(`
  CREATE TABLE types (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const locationsTablePromise = db.query(`
  CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    settlement VARCHAR NOT NULL,
    county VARCHAR NOT NULL
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);

  await Promise.all([
    typesTablePromise,
    locationsTablePromise,
    usersTablePromise,
  ]);

  await db.query(`
  CREATE TABLE finds (
    find_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    type VARCHAR NOT NULL REFERENCES types(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    img_url VARCHAR,
    location_id INT REFERENCES locations(location_id) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    likes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    find_id INT REFERENCES finds(find_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    likes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
};

const dropTables = async () => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS finds;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS locations;`);
  await db.query(`DROP TABLE IF EXISTS types;`);
};

module.exports = { createTables, dropTables };
