const dbConfig = require("../config/db.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.ssl
    ? {
        ssl: {
          rejectUnauthorized: true,
        },
      }
    : {},
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./productModel.js")(sequelize, Sequelize);
db.user = require("./userModel.js")(sequelize, Sequelize);
db.role = require("./roleModel.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

module.exports = db;
