const format = require("pg-format");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../helpers/utils");
const db = require("../connection");
const { dropTables, createTables } = require("../helpers/manage-tables");

const seed = async ({
  typeData,
  locationData,
  userData,
  findData,
  commentData,
}) => {
  await dropTables();
  await createTables();

  const insertTypesQueryStr = format(
    "INSERT INTO types (slug, description) VALUES %L RETURNING *;",
    typeData.map(({ slug, description }) => [slug, description])
  );
  const typesPromise = db
    .query(insertTypesQueryStr)
    .then((result) => result.rows);

  const insertLocationsQueryStr = format(
    "INSERT INTO locations (settlement, county) VALUES %L RETURNING *;",
    locationData.map(({ settlement, county }) => [settlement, county])
  );
  const locationsPromise = db
    .query(insertLocationsQueryStr)
    .then((result) => result.rows);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar_url, bio) VALUES %L RETURNING *;",
    userData.map(({ username, name, avatar_url, bio }) => [
      username,
      name,
      avatar_url,
      bio
    ])
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  await Promise.all([typesPromise, locationsPromise, usersPromise]);

  const formattedFindData = findData.map(convertTimestampToDate);
  const insertFindsQueryStr = format(
    "INSERT INTO finds (title, type, author, body, img_url, location_id, latitude, longitude, created_at, likes) VALUES %L RETURNING *;",
    formattedFindData.map(
      ({
        title,
        type,
        author,
        body,
        img_url,
        location_id,
        latitude,
        longitude,
        created_at,
        likes = 0,
      }) => [
        title,
        type,
        author,
        body,
        img_url,
        location_id,
        latitude,
        longitude,
        created_at,
        likes,
      ]
    )
  );

  const findRows = await db
    .query(insertFindsQueryStr)
    .then((result) => result.rows);

  const findIdLookup = createRef(findRows, "title", "find_id");
  const formattedCommentData = formatComments(commentData, findIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, find_id, likes, created_at) VALUES %L RETURNING *;",
    formattedCommentData.map(
      ({ body, author, find_id, likes = 0, created_at }) => [
        body,
        author,
        find_id,
        likes,
        created_at,
      ]
    )
  );
  return db.query(insertCommentsQueryStr).then((result) => result.rows);
};

module.exports = seed;
