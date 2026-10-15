const db = require("./app/models");
const seedAdmin = require("./seedAdmin");
const Role = db.role;

// Creates missing tables, then seeds roles, then the admin, in that order.
// Runs automatically on local `npm start`; for the deployed DB run `npm run db:setup` once.
async function setupDb() {
  await db.sequelize.sync({ force: false }); // Use `force: true` only for resetting the database during development
  console.log("Database synchronized successfully!");

  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate([
      { id: 1, name: "user" },
      { id: 2, name: "admin" },
    ]);
    console.log("Roles seeded successfully!");
  }

  await seedAdmin();
}

module.exports = setupDb;

if (require.main === module) {
  setupDb()
    .catch((err) => {
      console.error("Database setup failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => db.sequelize.close());
}
