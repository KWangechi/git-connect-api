const express = require("express");
const router = express.Router({ mergeParams: true });
const { index, show } = require("../controllers/PostController");
const {
  index: viewAllComments,
  store: createComment,
  update: updateComment,
  destroy: deleteComment,
} = require("../controllers/CommentController");

const commentRoutePrefix = "/:postId/comments";

router.get("/", index);
router.get("/:id", show);

// comments
router.get(commentRoutePrefix, viewAllComments);
router.post(commentRoutePrefix, createComment);
router.patch(`${commentRoutePrefix}/:id`, updateComment);
router.delete(`${commentRoutePrefix}/:id`, deleteComment);

module.exports = router;
