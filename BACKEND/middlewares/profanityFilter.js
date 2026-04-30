import { Filter } from "bad-words";

const filter = new Filter();

// Add custom bad words specific to your app
filter.addWords("spam", "scam", "fake");

// ─── Profanity Check Middleware ───────────────────────────
export const profanityFilter = (req, res, next) => {
  const { content } = req.body;

  if (!content) return next();

  if (filter.isProfane(content)) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Feedback contains inappropriate language. Please keep it respectful!",
    });
  }

  next();
};

// ─── Clean text utility (used in controller) ─────────────
export const cleanText = (text) => {
  try {
    return filter.clean(text);
  } catch {
    return text;
  }
};