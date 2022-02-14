exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "null value in body violates not-null constraint" });
  }
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: `invalid input syntax for type integer` });
  } else next(err);
};
