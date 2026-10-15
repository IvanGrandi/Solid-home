const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

// Compared against when the username doesn't exist, so an unknown user takes as long as a wrong password
const DUMMY_HASH = bcrypt.hashSync("timing-equalizer", config.saltRounds);

// Signs a token and sends the session payload used by both login and registration
const sendSession = (res, status, user, roleNames) => {
  const token = jwt.sign({ id: user.id, roles: roleNames }, config.secret, {
    expiresIn: config.expiresIn,
  });

  res.status(status).send({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: roleNames,
    accessToken: token,
  });
};

exports.register = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, config.saltRounds),
    });

    // Public sign-up always gets the "user" role; admins are created with `npm run db:setup`
    const userRole = await Role.findOne({ where: { name: "user" } });
    await user.setRoles([userRole]);

    // Log the new user in straight away
    sendSession(res, 201, user, [userRole.name]);
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).send({ message: "Registration failed." });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).send({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email: email.trim() } });
    const passwordIsValid = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    // Same response for unknown email and wrong password, so registered emails can't be discovered
    if (!user || !passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid email or password.",
      });
    }

    if (user.blocked) {
      return res.status(403).send({
        accessToken: null,
        message: "Your account has been blocked by an administrator.",
      });
    }

    // Transparently upgrade hashes created with the old, weaker cost factor
    if (bcrypt.getRounds(user.password) < config.saltRounds) {
      user.password = await bcrypt.hash(password, config.saltRounds);
      await user.save();
    }

    const roles = await user.getRoles();
    sendSession(res, 200, user, roles.map((role) => role.name));
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send({ message: "Login failed." });
  }
};
