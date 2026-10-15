const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifySignUp = require("../middleware/verifySignUp");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimit");

// Registration route with middleware
router.post(
  "/register",
  [registerLimiter, verifySignUp.validateRegistration, verifySignUp.checkDuplicateUsernameOrEmail],
  authController.register
);

// Login route
router.post("/login", loginLimiter, authController.signin);

module.exports = router;
