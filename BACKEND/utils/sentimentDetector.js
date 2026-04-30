// ─── Keyword-based Sentiment Detector ────────────────────
// No external API needed — runs locally!

const positiveWords = [
  "good", "great", "excellent", "amazing", "awesome", "fantastic",
  "love", "perfect", "wonderful", "best", "happy", "thank", "thanks",
  "helpful", "easy", "smooth", "fast", "clean", "nice", "brilliant",
  "superb", "outstanding", "impressive", "beautiful", "enjoy",
  "pleased", "satisfied", "recommend", "useful", "intuitive"
];

const negativeWords = [
  "bad", "terrible", "awful", "horrible", "worst", "hate", "broken",
  "slow", "ugly", "useless", "difficult", "confusing", "frustrating",
  "annoying", "poor", "disappointing", "failed", "error", "crash",
  "problem", "issue", "bug", "wrong", "confused", "complicated",
  "painful", "ridiculous", "disgusting", "unacceptable", "waste"
];

const intensifiers = ["very", "so", "extremely", "really", "absolutely"];
const negators = ["not", "never", "no", "don't", "doesn't", "isn't", "wasn't"];

export const detectSentiment = (text) => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = words[i - 1] || "";
    const isNegated = negators.includes(prevWord);
    const isIntensified = intensifiers.includes(prevWord);
    const multiplier = isIntensified ? 2 : 1;

    if (positiveWords.includes(word)) {
      const value = 1 * multiplier;
      score += isNegated ? -value : value;
      isNegated ? negativeCount++ : positiveCount++;
    }

    if (negativeWords.includes(word)) {
      const value = 1 * multiplier;
      score += isNegated ? value : -value;
      isNegated ? positiveCount++ : negativeCount++;
    }
  }

  // ─── Determine sentiment ──────────────────────────────
  let sentiment;
  if (score > 0) sentiment = "positive";
  else if (score < 0) sentiment = "negative";
  else sentiment = "neutral";

  return {
    sentiment,
    score,
    positiveCount,
    negativeCount,
    confidence: Math.min(Math.abs(score) * 20, 100) + "%"
  };
};