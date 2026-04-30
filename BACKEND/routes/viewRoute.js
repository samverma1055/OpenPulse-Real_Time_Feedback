import express from "express";
import Feedback from "../models/feedbackModel.js";
import User from "../models/userModel.js";
import passport from "passport";

const router = express.Router();

// ─── Home Page ────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const totalFeedback = await Feedback.countDocuments();
    const totalUsers = await User.countDocuments();
    const resolved = await Feedback.countDocuments({ status: "resolved" });

    res.render("index", {
      feedbacks,
      totalFeedback,
      totalUsers,
      resolved,
      user: req.user || null,
      page: "home"
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── Login Page ───────────────────────────────────────────
router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/dashboard");
  res.render("login", {
    error: req.session.error || null,
    user: null,
    page: "login"
  });
  delete req.session.error;
});

// ─── Register Page ────────────────────────────────────────
router.get("/register", (req, res) => {
  if (req.user) return res.redirect("/dashboard");
  res.render("register", {
    error: req.session.error || null,
    user: null,
    page: "register"
  });
});

// ─── Dashboard Page ───────────────────────────────────────
router.get("/dashboard", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  try {
    const feedbacks = await Feedback.find()
      .populate("submittedBy", "username email")
      .sort({ createdAt: -1 });

    const stats = {
      total: feedbacks.length,
      pending: feedbacks.filter(f => f.status === "pending").length,
      resolved: feedbacks.filter(f => f.status === "resolved").length,
      anonymous: feedbacks.filter(f => f.isAnonymous).length,
    };

    res.render("dashboard", {
      feedbacks,
      stats,
      user: req.user,
      page: "dashboard"
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── Feedback Page ────────────────────────────────────────
router.get("/feedback", async (req, res) => {
  try {
    const { category, sentiment } = req.query;
    let filter = {};
    if (category && category !== "all") filter.category = category;
    if (sentiment && sentiment !== "all") filter.sentiment = sentiment;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 });

    res.render("feedback", {
      feedbacks,
      user: req.user || null,
      category: category || "all",
      sentiment: sentiment || "all",
      page: "feedback"
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── POST Login (Passport Local) ─────────────────────────
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.error = info?.message || "Login failed";
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

// ─── POST Register ────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      req.session.error = "Email already registered";
      return res.redirect("/register");
    }
    await User.create({ username, email, password, role: role || "user" });
    res.redirect("/login");
  } catch (err) {
    req.session.error = err.message;
    res.redirect("/register");
  }
});

// ─── POST Submit Feedback ─────────────────────────────────
router.post("/feedback/submit", async (req, res) => {
  try {
    const { content, category, sentiment, isAnonymous } = req.body;
    await Feedback.create({
      content,
      category,
      sentiment,
      isAnonymous: isAnonymous === "on",
      submittedBy: isAnonymous === "on" ? null : req.user?._id,
    });
    res.redirect("/feedback");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── POST Update Status (Admin) ──────────────────────────
router.post("/dashboard/status/:id", async (req, res) => {
  if (!req.user || req.user.role !== "admin") return res.redirect("/login");
  try {
    await Feedback.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── POST Delete (Admin) ──────────────────────────────────
router.post("/dashboard/delete/:id", async (req, res) => {
  if (!req.user || req.user.role !== "admin") return res.redirect("/login");
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── Logout ───────────────────────────────────────────────
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect("/");
  });
});

export default router;