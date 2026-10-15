const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const db = require("./app/models");
const config = require("./app/config/auth.config");
const Role = db.role;
const User = db.user;

// Admin credentials come from the environment so they are never committed to the repo
async function seedAdmin() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD not set. Skipping admin creation.");
    return;
  }

  try {
    const existingAdmin = await User.findOne({
      where: { [Op.or]: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }] },
    });

    if (existingAdmin) {
      console.log("Admin already exists. Skipping creation.");
      return;
    }

    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
      console.log("Admin role does not exist. Please create roles first.");
      return;
    }

    const admin = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: await bcrypt.hash(ADMIN_PASSWORD, config.saltRounds),
    });

    await admin.setRoles([adminRole]);
    console.log("Admin user created successfully!");
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  }
}

module.exports = seedAdmin;
