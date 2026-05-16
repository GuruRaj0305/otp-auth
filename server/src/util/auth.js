const crypto = require("crypto");
const { SMTP } = require("../config/config");

const hashValue = (value) => crypto.createHash("sha256").update(value).digest("hex");



const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^\+?[1-9]\d{7,14}$/.test(value);

const getUserSearch = (identifier) => (
  isEmail(identifier)
    ? { emailId: identifier }
    : { phoneNumber: identifier}
  );


const sendOtp = (identifier, otp) => {
  const targetType = isEmail(identifier) ? "email" : "phone";
  console.log(
    `OTP send via ${targetType} to ${identifier}: ${otp}.`,
  );
};

module.exports = {
  getUserSearch,
  hashValue,
  isEmail,
  isPhone,
  sendOtp,
};
