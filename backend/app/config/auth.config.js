require("dotenv").config({ quiet: true });

// Fail fast instead of silently signing tokens with a guessable default secret
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to backend/.env (and to the Vercel project settings).");
}

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: 86400, // 24 hours
  saltRounds: 10, // bcrypt cost factor
};
