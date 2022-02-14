exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "error - null value given" });
  }
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "error - invalid input" });
  } else next(err);
};
