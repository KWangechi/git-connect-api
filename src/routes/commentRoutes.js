const express = require("express");
const router = express.Router({ mergeParams: true });
const { index, show, store } = require("../controllers/CommentController");

router.get("/", index);
router.get("/:id", show);
router.post("/:id", store);

module.exports = router;
