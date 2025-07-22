const express = require("express");
const router = express.Router();
const { register, login, forgotPassword } = require("../controllers/authController");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Forgot password route
router.post("/forgot-password", forgotPassword);

module.exports = router;
