const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  show,
  update,
  destroy,
} = require("../controllers/UserProfileController");

router.get("/", show);
router.patch("/", update);
router.delete("/", destroy);

module.exports = router;
