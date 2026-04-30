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
import { profanityFilter } from "../middlewares/profanityFilter.js";

const router = express.Router();

// profanityFilter runs BEFORE submitFeedback
router.post("/submit", profanityFilter, submitFeedback);
router.get("/all", getAllFeedback);
router.get("/:id", getSingleFeedback);
router.put("/upvote/:id", upvoteFeedback);
router.put("/status/:id", isAuthenticated, isAdmin, updateFeedbackStatus);
router.delete("/:id", isAuthenticated, isAdmin, deleteFeedback);

export default router;