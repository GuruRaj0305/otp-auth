const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      field: "phone_number",
      validate: {
        is: /^\+?[1-9]\d{7,14}$/,
      },
    },
    emailId: {
      type: DataTypes.STRING,
      unique: true,
      field: "email_id",
      validate: {
        isEmail: true,
      },
    },
    blockedUntil: {
      type: DataTypes.DATE,
      field: "blocked_until",
    },
  },
  {
    tableName: "users",
    underscored: true,
  },
);

module.exports = User;
