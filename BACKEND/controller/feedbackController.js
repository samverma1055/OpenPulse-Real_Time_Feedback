import {
  submitFeedbackService,
  getAllFeedbackService,
  getSingleFeedbackService,
  upvoteFeedbackService,
  updateFeedbackStatusService,
  deleteFeedbackService,
} from "../services/feedbackService.js";

// ─── SUBMIT FEEDBACK ──────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { content, category, isAnonymous } = req.body;
    const { feedback, sentimentResult } = await submitFeedbackService({
      content,
      category,
      isAnonymous,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted!",
      feedback,
      sentimentAnalysis: sentimentResult,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL FEEDBACK ─────────────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await getAllFeedbackService(req.query);
    res.status(200).json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE FEEDBACK ──────────────────────────────────
export const getSingleFeedback = async (req, res) => {
  try {
    const feedback = await getSingleFeedbackService(req.params.id);
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── UPVOTE FEEDBACK ──────────────────────────────────────
export const upvoteFeedback = async (req, res) => {
  try {
    const voterIP =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;

    const upvotes = await upvoteFeedbackService(req.params.id, voterIP);
    res.status(200).json({ success: true, message: "✅ Upvoted successfully!", upvotes });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE STATUS ────────────────────────────────────────
export const updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await updateFeedbackStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: "Status updated!", feedback });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── DELETE FEEDBACK ──────────────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    await deleteFeedbackService(req.params.id);
    res.status(200).json({ success: true, message: "Feedback deleted!" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};