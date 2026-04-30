import Feedback from "../models/feedbackModel.js";
import { io } from "../server.js";
import { cleanText } from "../middlewares/profanityFilter.js";
import { detectSentiment } from "../utils/sentimentDetector.js";

// ─── SUBMIT FEEDBACK ──────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    let { content, category, isAnonymous } = req.body;

    // ─── Auto detect sentiment ──────────────────────────
    const sentimentResult = detectSentiment(content);
    const sentiment = sentimentResult.sentiment;

    // ─── Clean profanity (double safety after middleware) 
    content = cleanText(content);

    const feedback = await Feedback.create({
      content,
      category,
      sentiment,        // ← auto detected!
      isAnonymous: isAnonymous ?? true,
      submittedBy: isAnonymous ? null : req.user?.id,
    });

    // ⚡ Broadcast to all connected clients
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

    res.status(201).json({
      success: true,
      message: "Feedback submitted!",
      feedback,
      sentimentAnalysis: sentimentResult, // show analysis in response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL FEEDBACK ─────────────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const { category, status, sentiment } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (sentiment) filter.sentiment = sentiment;

    const feedbacks = await Feedback.find(filter)
      .populate("submittedBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
        message: "Feedback not found"
      });
    }

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPVOTE (spam protected) ──────────────────────────────
export const upvoteFeedback = async (req, res) => {
  try {
    // Get voter IP address
    const voterIP = req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;

    // Check if already voted
    const feedback = await Feedback.findById(req.params.id).select("+voters");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    if (feedback.voters.includes(voterIP)) {
      return res.status(400).json({
        success: false,
        message: "⚠️ You have already upvoted this feedback!",
      });
    }

    // Add IP to voters and increment upvotes
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { upvotes: 1 },
        $push: { voters: voterIP },
      },
      { new: true }
    );

    // ⚡ Broadcast live upvote
    io.to("feedback_room").emit("upvote_updated", {
      _id: updated._id,
      upvotes: updated.upvotes,
    });

    res.status(200).json({
      success: true,
      message: "✅ Upvoted successfully!",
      upvotes: updated.upvotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE STATUS ────────────────────────────────────────
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
        message: "Feedback not found"
      });
    }

    io.to("feedback_room").emit("status_updated", {
      _id: feedback._id,
      status: feedback.status,
    });

    res.status(200).json({
      success: true,
      message: "Status updated!",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    io.to("feedback_room").emit("feedback_deleted", {
      _id: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Feedback deleted!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};