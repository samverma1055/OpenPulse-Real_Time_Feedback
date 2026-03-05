import Feedback from "../models/feedbackModel.js";

// ─── SUBMIT FEEDBACK ──────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { content, category, sentiment, isAnonymous } = req.body;

    const feedback = await Feedback.create({
      content,
      category,
      sentiment,
      isAnonymous: isAnonymous ?? true,
      submittedBy: isAnonymous ? null : req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET ALL FEEDBACK (Admin) ─────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const { category, status, sentiment } = req.query;

    // Build filter dynamically
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (sentiment) filter.sentiment = sentiment;

    const feedbacks = await Feedback.find(filter)
      .populate("submittedBy", "username email")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET SINGLE FEEDBACK ──────────────────────────────────
export const getSingleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("submittedBy", "username email");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE FEEDBACK STATUS (Admin) ──────────────────────
export const updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated!",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPVOTE FEEDBACK ──────────────────────────────────────
export const upvoteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Upvoted!",
      upvotes: feedback.upvotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE FEEDBACK (Admin) ──────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};