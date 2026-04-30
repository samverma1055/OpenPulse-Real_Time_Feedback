import Feedback from "../models/feedbackModel.js";
import { io } from "../server.js";
import { cleanText } from "../middlewares/profanityFilter.js";
import { detectSentiment } from "../utils/sentimentDetector.js";

// ─── SUBMIT FEEDBACK ──────────────────────────────────────
export const submitFeedbackService = async ({ content, category, isAnonymous, userId }) => {
  // Auto detect sentiment
  const sentimentResult = detectSentiment(content);
  const sentiment = sentimentResult.sentiment;

  // Clean profanity (double safety after middleware)
  const cleanedContent = cleanText(content);

  const feedback = await Feedback.create({
    content: cleanedContent,
    category,
    sentiment,
    isAnonymous: isAnonymous ?? true,
    submittedBy: isAnonymous ? null : userId,
  });

  // Broadcast to all connected clients
  io.to("feedback_room").emit("new_feedback", {
    _id: feedback._id,
    content: feedback.content,
    category: feedback.category,
    sentiment: feedback.sentiment,
    isAnonymous: feedback.isAnonymous,
    upvotes: feedback.upvotes,
    status: feedback.status,
    createdAt: feedback.createdAt,
  });

  return { feedback, sentimentResult };
};

// ─── GET ALL FEEDBACK ─────────────────────────────────────
export const getAllFeedbackService = async ({ category, status, sentiment }) => {
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (sentiment) filter.sentiment = sentiment;

  const feedbacks = await Feedback.find(filter)
    .populate("submittedBy", "username email")
    .sort({ createdAt: -1 });

  return feedbacks;
};

// ─── GET SINGLE FEEDBACK ──────────────────────────────────
export const getSingleFeedbackService = async (id) => {
  const feedback = await Feedback.findById(id)
    .populate("submittedBy", "username email");

  if (!feedback) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  return feedback;
};

// ─── UPVOTE FEEDBACK (spam protected) ────────────────────
export const upvoteFeedbackService = async (id, voterIP) => {
  const feedback = await Feedback.findById(id).select("+voters");

  if (!feedback) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  if (feedback.voters.includes(voterIP)) {
    const error = new Error("⚠️ You have already upvoted this feedback!");
    error.statusCode = 400;
    throw error;
  }

  const updated = await Feedback.findByIdAndUpdate(
    id,
    {
      $inc: { upvotes: 1 },
      $push: { voters: voterIP },
    },
    { new: true }
  );

  // Broadcast live upvote
  io.to("feedback_room").emit("upvote_updated", {
    _id: updated._id,
    upvotes: updated.upvotes,
  });

  return updated.upvotes;
};

// ─── UPDATE STATUS ────────────────────────────────────────
export const updateFeedbackStatusService = async (id, status) => {
  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!feedback) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  io.to("feedback_room").emit("status_updated", {
    _id: feedback._id,
    status: feedback.status,
  });

  return feedback;
};

// ─── DELETE FEEDBACK ──────────────────────────────────────
export const deleteFeedbackService = async (id) => {
  const feedback = await Feedback.findByIdAndDelete(id);

  if (!feedback) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  io.to("feedback_room").emit("feedback_deleted", {
    _id: id,
  });
};