const { rateLimit } = require("express-rate-limit");

// Note: the default store is in-memory, so on Vercel each serverless instance keeps its own counter.
// That still slows down brute force considerably; use a shared store (e.g. Redis) for a hard limit.

// Only failed attempts count, so a user who logs in successfully is never locked out
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many failed login attempts. Please try again in 15 minutes." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many accounts created from this IP. Please try again later." },
});

module.exports = {
  loginLimiter,
  registerLimiter,
};
