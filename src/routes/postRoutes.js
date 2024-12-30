const express = require("express");
const router = express.Router({ mergeParams: true });
const { index, show } = require("../controllers/PostController");

router.get("/", index);
router.get("/:id", show);

module.exports = router;
