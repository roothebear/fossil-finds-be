const {
  selectUsers,
  selectUserByUsername,
  selectFindsByUsername,
  selectCommentsByUsername,
  insertUser,
  updateUserByUsername,
  // deleteUserByUsername,
} = require("../models/users.models.js");

exports.getUsers = (req, res, next) => {
  selectUsers(req)
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url, bio } = req.body;
  insertUser(username, name, avatar_url, bio)
    .then((user) => {
      res.status(201).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const { name, avatar_url, bio } = req.body;
  updateUserByUsername(username, name, avatar_url, bio)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeUserByUsername = (req, res, next) => {
  const { username } = req.params;
  deleteUserByUsername(username)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getFindsByUsername = (req, res, next) => {
  const { username } = req.params;
  const { limit, page } = req.query;
  selectFindsByUsername(username, limit, page)
    .then((finds) => {
      res.status(200).send({ finds: finds });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByUsername = (req, res, next) => {
  const { username } = req.params;
  const { limit, page } = req.query;
  selectCommentsByUsername(username, limit, page)
    .then((comments) => {
      res.status(200).send({comments: comments});
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
};