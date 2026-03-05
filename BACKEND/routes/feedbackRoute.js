import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getSingleFeedback,
  updateFeedbackStatus,
  upvoteFeedback,
  deleteFeedback,
} from "../controller/feedbackController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/submit", submitFeedback);
router.get("/all", getAllFeedback);
router.get("/:id", getSingleFeedback);
router.put("/upvote/:id", upvoteFeedback);

// Admin only routes
router.put("/status/:id", isAuthenticated, isAdmin, updateFeedbackStatus);
router.delete("/:id", isAuthenticated, isAdmin, deleteFeedback);

export default router;