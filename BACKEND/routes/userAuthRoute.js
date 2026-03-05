import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
} from "../controller/userAuthController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public routes (no login needed)
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes (must be logged in)
router.get("/me", isAuthenticated, getMyProfile);

export default router;