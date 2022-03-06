const {
  selectFinds,
  selectFindById,
  selectCommentsByFindId,
  updateFindById,
  insertFind,
  insertCommentByFindId,
  deleteFindById,
} = require("../models/finds.models.js");

exports.getFinds = (req, res, next) => {
  const { sort_by, order, type, limit, page } = req.query;
  selectFinds(sort_by, order, type, limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getFindById = (req, res, next) => {
  const { find_id } = req.params;
  selectFindById(find_id)
    .then((find) => {
      res.status(200).send({ find: find });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByFindId = (req, res, next) => {
  const { find_id } = req.params;
  const { limit, page } = req.query;
  selectCommentsByFindId(find_id, limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchFindById = (req, res, next) => {
  const { find_id } = req.params;
  const { inc_likes } = req.body;
  updateFindById(find_id, inc_likes)
    .then((find) => {
      res.status(200).send({ find: find });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByFindId = (req, res, next) => {
  const { find_id } = req.params;
  const { username, body } = req.body;
  insertCommentByFindId(find_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postFind = (req, res, next) => {
  const { author, title, body, img_url, location_id, latitude, longitude, type } = req.body;
  insertFind(author, title, body, img_url, location_id, latitude, longitude, type)
    .then((find) => {
      res.status(201).send({ find: find });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeFindById = (req, res, next) => {
  const { find_id } = req.params;
  deleteFindById(find_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};