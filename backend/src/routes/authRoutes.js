const express = require("express");
const AuthController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes (không cần token)
router.post("/register", AuthController.register); // POST /api/auth/register
router.post("/login", AuthController.login); // POST /api/auth/login
router.post("/logout", AuthController.logout); // POST /api/auth/logout
router.post("/refresh", AuthController.refreshToken); // POST /api/auth/refresh

// Protected routes (cần token)
router.get("/me", authMiddleware, AuthController.getCurrentUser); // GET /api/auth/me

module.exports = router;
