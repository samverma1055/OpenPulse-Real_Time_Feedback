import express from "express";
import passport from "../middlewares/passport.js";
import {
  register,
  login,
  logout,
  getMyProfile,
} from "../controller/userAuthController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// ─── Existing routes ──────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

// ─── NEW: Passport Local login ────────────────────────────
router.post("/passport/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Login failed",
      });
    }
    // Save user in session
    req.logIn(user, (err) => {
      if (err) return next(err);
      const token = user.generateToken();
      return res.status(200).json({
        success: true,
        message: "Logged in via Passport Local!",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        session: req.session.id,
      });
    });
  })(req, res, next);
});

// ─── NEW: Passport JWT protected route ───────────────────
router.get("/passport/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Accessed via Passport JWT!",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

// ─── NEW: Check session ───────────────────────────────────
// ─── Check session ────────────────────────────────────────
router.get("/session", (req, res) => {
  try {
    // Manual session check without passport
    if (req.session && req.session.passport && req.session.passport.user) {
      return res.status(200).json({
        success: true,
        message: "Active session found!",
        sessionId: req.session.id,
        sessionData: req.session.passport,
      });
    }
    res.status(401).json({
      success: false,
      message: "No active session",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;