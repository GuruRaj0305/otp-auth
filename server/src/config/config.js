require("dotenv").config();

const DATABASE = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    timezone: '+05:30',
};


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};


const ACCESS_TOKEN_EXPIRES_IN = Number(process.env.JWT_EXPIRES) || 24 * 60 * 60;
const JWT_SECRET = process.env.JWT_SECRET;

const SERVER_PORT = process.env.PORT || 5000;
const OTP_EXPIRATION_TIME = Number(process.env.OTP_EXPIRATION_TIME) || 5 * 60 * 1000;
const OTP_LENGTH = Number(process.env.OTP_LENGTH) || 6;
const BLOCK_DURATION = Number(process.env.BLOCK_DURATION) || 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS) || 3;

const SMTP = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000, // Convert seconds to milliseconds
};


module.exports = {
  DATABASE,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_SECRET,
  SERVER_PORT,
  OTP_EXPIRATION_TIME,
  OTP_LENGTH,
  BLOCK_DURATION,
  MAX_OTP_ATTEMPTS,
  SMTP,
  ACCESS_TOKEN_COOKIE_OPTIONS,
};