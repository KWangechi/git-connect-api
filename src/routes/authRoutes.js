const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  logout,
} = require("../controllers/auth/AuthController");
const { index } = require("../controllers/UserProfileController");
const verifyToken = require("../middlewares/authMiddleware");

const authPath = "/auth";

router.post(`${authPath}/login`, loginUser);
router.post(`${authPath}/register`, registerUser);
router.get(`${authPath}/logout`, logout);

// get all the users
router.get("/developers", verifyToken, index);

module.exports = router;
