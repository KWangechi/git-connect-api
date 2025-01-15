const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  logout,
} = require("../controllers/authController");
const { index, search } = require("../controllers/UserProfileController");
const verifyToken = require("../middlewares/authMiddleware");

const authPath = "/auth";

router.post(`${authPath}/login`, loginUser);
router.post(`${authPath}/register`, registerUser);
router.get(`${authPath}/logout`, verifyToken, logout);

// get all the users
router.get("/developers", verifyToken, index);
router.get("/developers/search", verifyToken, search);

module.exports = router;
