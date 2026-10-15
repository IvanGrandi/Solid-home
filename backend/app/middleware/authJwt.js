const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;
const Role = db.role;

// Verify the token, and that its user still exists and isn't blocked
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  try {
    // Roles are loaded from the DB rather than trusted from the token, so changes apply immediately
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "blocked"],
      include: [{ model: Role, attributes: ["name"], through: { attributes: [] } }],
    });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    if (user.blocked) {
      return res.status(403).send({ message: "Your account has been blocked by an administrator." });
    }

    req.userId = user.id;
    req.userRoles = user.roles.map((role) => role.name);
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Verify if the user has an "admin" role (must run after verifyToken)
const isAdmin = (req, res, next) => {
  if (req.userRoles && req.userRoles.includes("admin")) {
    return next();
  }
  res.status(403).send({ message: "Require Admin Role!" });
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
