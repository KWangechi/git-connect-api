const express = require("express");
const router = express.Router({ mergeParams: true });
const { update, store, destroy } = require("../controllers/PostController");

router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
