const { sequelize } = require("../config/database");
const User = require("./user.model");
const Otp = require("./otp.model");

User.hasOne(Otp, {
  foreignKey: "userId",
  as: "otp",
  onDelete: "CASCADE",
});

Otp.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const syncDatabase = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Otp,
};
