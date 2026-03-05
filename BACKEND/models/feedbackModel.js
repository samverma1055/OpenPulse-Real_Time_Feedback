import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Feedback content is required"],
    minlength: [5, "Feedback must be at least 5 characters"],
    maxlength: [500, "Feedback cannot exceed 500 characters"],
    trim: true,
  },
  category: {
    type: String,
    enum: ["general", "bug", "suggestion", "complaint"],
    default: "general",
  },
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    default: "neutral",
  },
  isAnonymous: {
    type: Boolean,
    default: true, // Core feature of OpenPulse!
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null = truly anonymous
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feedback", feedbackSchema);