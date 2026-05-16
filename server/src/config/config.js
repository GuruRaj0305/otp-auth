require("dotenv").config();

const DATABASE = {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
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


const ACCESS_TOKEN_EXPIRES_IN = Number(process.env.JWT_EXPIRES);
const JWT_SECRET = process.env.JWT_SECRET;

const SERVER_PORT = process.env.PORT || 5000;

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
    ACCESS_TOKEN_COOKIE_OPTIONS,
};

