const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

const authRoutes = require("./authRoutes");
router.use("/auth", authRoutes);

// protected routes
const userProfileRoutes = require("./userProfileRoutes");
// const postRoutes = require("./postRoutes");

router.use(
  "/developers/:username/profile",
  verifyToken,
  userProfileRoutes
);
// router.use("/v1/posts", postRoutes);

module.exports = router;
