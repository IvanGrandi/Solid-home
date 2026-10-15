const db = require("../models");
const { Op } = db.Sequelize;
const User = db.user;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate and normalize the registration payload
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (typeof username !== "string" || username.trim().length < 3 || username.trim().length > 30) {
    return res.status(400).send({ message: "Username must be between 3 and 30 characters." });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).send({ message: "Please provide a valid email address." });
  }
  // bcrypt only uses the first 72 bytes of a password
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    return res.status(400).send({ message: "Password must be between 8 and 72 characters." });
  }

  req.body.username = username.trim();
  req.body.email = email.trim();
  next();
};

// Check if the username or email already exists in the database
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const existing = await User.findOne({
      where: { [Op.or]: [{ username: req.body.username }, { email: req.body.email }] },
    });

    if (existing) {
      const field = existing.username === req.body.username ? "Username" : "Email";
      return res.status(400).send({ message: `Failed! ${field} is already in use!` });
    }
    next();
  } catch (err) {
    console.error("Error checking duplicate user:", err.message);
    res.status(500).send({ message: "Registration failed." });
  }
};

const verifySignUp = {
  validateRegistration,
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
