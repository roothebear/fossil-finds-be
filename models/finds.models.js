const db = require("../db/connection.js");

exports.selectFinds = (
  sort_by = "created_at",
  order = "desc",
  type,
  limit = 10,
  page = 1
) => {
  // deal with invalid queries
  const validSortBy = [
    "title",
    "type",
    "author",
    "body",
    "location_id",
    "settlement",
    "county",
    "created_at",
    "likes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Error - Invalid sort_by or order query",
    });
  }

  let queryStr = `SELECT 
  finds.find_id, 
  finds.title, 
  finds.type, 
  finds.author, 
  finds.body,
  finds.img_url,
  finds.location_id,
  finds.latitude,
  finds.longitude,
  finds.created_at, 
  finds.likes, 
  locations.settlement,
  locations.county,
  COUNT(comment_id )::INT AS comment_count 
  FROM finds 
  FULL JOIN comments 
  ON finds.find_id = comments.find_id
  JOIN locations
  ON finds.location_id = locations.location_id`;

  // deal with type
  if (type) {
    // don't understand why quotations needed below, lucky troubleshooting!!
    queryStr += ` WHERE finds.type = '${type}'`;
  }

  // set find offset value by page number
  const offset = limit * (page - 1);

  const allFindsQuery =
    queryStr + ` GROUP BY finds.find_id, locations.settlement, locations.county ORDER BY ${sort_by} ${order};`;

  const findsByPageQuery =
    queryStr +
    ` GROUP BY finds.find_id, locations.settlement, locations.county ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2;`;

  // build final result object to respond with to controller
  const resultObject = {};

  return db
    .query("SELECT slug FROM types;")
    .then((types) => {
      return types.rows.map((type) => type.slug);
    })
    .then((slugs) => {
      if (type && !slugs.includes(type)) {
        return Promise.reject({ status: 404, msg: "type not found" });
      } else {
        return type;
      }
    })
    .then(() => {
      return db
        .query(findsByPageQuery, [limit, offset])
        .then((response) => {
          resultObject.finds = response.rows;
          return response.rows;
        })
        .then(() => {
          return db.query(allFindsQuery).then((response) => {
            resultObject.totalCount = response.rows.length;
            return resultObject;
          });
        });
    });
};

exports.selectFindById = (find_id) => {
  return db
    .query(
      `SELECT finds.find_id, 
      finds.title, 
      finds.type, 
      finds.author, 
      finds.body, 
      finds.img_url,
      finds.location_id,
      finds.latitude,
      finds.longitude,
      finds.created_at, 
      finds.likes, 
      locations.settlement,
      locations.county,
      COUNT(comment_id )::INT AS comment_count 
      FROM finds
      FULL JOIN comments 
      ON finds.find_id = comments.find_id
      FULL JOIN locations 
      ON finds.location_id = locations.location_id
      WHERE finds.find_id = $1
      GROUP BY finds.find_id, locations.location_id;`,
      [find_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no find with this id exists",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.selectCommentsByFindId = (find_id, limit = 10, page = 1) => {
  const offset = limit * (page - 1);

  const resultObject = {};

  return db
    .query(
      `SELECT 
      comments.author, 
      comment_id, 
      comments.likes, 
      comments.body, 
      comments.created_at FROM comments
      JOIN finds ON comments.find_id = finds.find_id
            WHERE comments.find_id = $1
      LIMIT $2 OFFSET $3;`,
      [find_id, limit, offset]
    )
    .then((result) => {
      resultObject.comments = result.rows;
      return result.rows;
    })
    .then(() => {
      return db
        .query(
          `SELECT 
      comments.author, 
      comment_id, 
      comments.likes, 
      comments.body, 
      comments.created_at FROM comments
      JOIN finds ON comments.find_id = finds.find_id
            WHERE comments.find_id = $1;`,
          [find_id]
        )
        .then((result) => {
          resultObject.commentCount = result.rows.length;
          return resultObject;
        });
    });
};

// POST MODELS

exports.insertCommentByFindId = (find_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments 
      (author, body, find_id) 
      VALUES ( $1, $2, $3 )
      RETURNING *;`,
      [username, body, find_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.insertFind = (
  author,
  title,
  body,
  img_url,
  location_id,
  latitude,
  longitude,
  type
) => {
  return db
    .query(
      `INSERT INTO finds 
      (author, title, body, img_url, location_id, latitude, longitude, type ) 
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
      RETURNING *;`,
      [author, title, body, img_url, location_id, latitude, longitude, type]
    )
    .then((result) => {
      // take find_id from find returned
      const newFindId = result.rows[0]["find_id"];

      // return find with comment count
      return exports.selectFindById(newFindId);
    });
};

// PATCH MODELS

exports.updateFindById = (find_id, inc_likes) => {
  return db
    .query(
      `UPDATE finds 
    SET likes = likes + $1
    WHERE find_id = $2
    RETURNING *;`,
      [inc_likes, find_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "bad request - invalid sytnax used for inc_likes on body",
        });
      } else {
        return result.rows[0];
      }
    });
};

// DELETE MODELS

exports.deleteFindById = (find_id) => {
  return db
    .query("SELECT * FROM finds WHERE finds.find_id = $1;", [find_id])
    .then((find) => {
      if (find.rows.length === 0) {
        // if find does not exist return promise
        return Promise.reject({
          status: 404,
          msg: "no find with this id exists",
        });
      } else {
        return db
          .query(`DELETE FROM finds WHERE find_id = $1;`, [find_id])
          .then((result) => {
            return result;
          });
      }
    });
};
