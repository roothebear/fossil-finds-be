const findsRouter = require("express").Router();

const {
  getFinds,
  getFindById,
  getCommentsByFindId,
  patchFindById,
  postFind,
  postCommentByFindId,
  removeFindById,
} = require("../controllers/finds.controllers.js");

findsRouter.route("/").get(getFinds).post(postFind);

findsRouter
  .route("/:find_id")
  .get(getFindById)
  .patch(patchFindById)
  .delete(removeFindById);

findsRouter
  .route("/:find_id/comments")
  .get(getCommentsByFindId)
  .post(postCommentByFindId);

module.exports = findsRouter;
