const express = require("express");
const router = express.Router();

// const postRoutes = require("./postRoutes");
const authRoutes = require("./authRoutes");
// const userProfileRoutes = require("./userProfileRoutes");

router.use("/v1/auth", authRoutes);
// router.use("/v1/posts", postRoutes);
// router.use("/v1/user", userProfileRoutes);

module.exports = router;
