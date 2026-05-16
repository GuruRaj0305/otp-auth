const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Otp = sequelize.define(
  "Otp",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "user_id",
    },
    otpHash: {
      type: DataTypes.TEXT,
      field: "otp_hash",
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
  },
  {
    tableName: "otps",
    underscored: true,
  },
);

module.exports = Otp;
