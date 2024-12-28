const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  index,
  update,
  store,
  destroy,
} = require("../controllers/UserProfileController");

router.get("/:profile_id", index);
router.post("/", store);
router.patch("/", update);
router.delete("/", destroy);

module.exports = router;
