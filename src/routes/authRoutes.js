const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  logout,
} = require("../controllers/auth/AuthController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logout);

module.exports = router;
