const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  index,
  show,
  likePost,
  unlikePost,
} = require("../controllers/PostController");
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

// likes and dislikes
router.post("/:id/likePost", likePost);
router.post("/:id/unlikePost", unlikePost);

module.exports = router;
