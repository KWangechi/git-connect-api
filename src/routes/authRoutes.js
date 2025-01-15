const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  logout,
} = require("../controllers/AuthController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", verifyToken, logout);

module.exports = router;
