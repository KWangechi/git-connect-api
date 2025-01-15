const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

const authRoutes = require("./authRoutes");
router.use("/", authRoutes);

// protected routes
const userProfileRoutes = require("./userProfileRoutes");
const postRoutes = require("./postRoutes");
const userPostRoutes = require("./userPostRoutes");

router.use("/developers/:username/profile", verifyToken, userProfileRoutes);
router.use("/posts", verifyToken, postRoutes);
router.use("/developers/:username/posts", verifyToken, userPostRoutes);

module.exports = router;
