const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  update,
  store,
  destroy,
  fetchUserPosts,
} = require("../controllers/PostController");

router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

router.get("/", fetchUserPosts);

module.exports = router;
