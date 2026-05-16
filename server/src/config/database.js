const { Sequelize } = require("sequelize");
const { DATABASE } = require("./config");

const sequelize = new Sequelize(
  DATABASE.database,
  DATABASE.username,
  DATABASE.password,
  {
    host: DATABASE.host,
    port: DATABASE.port,
    dialect: DATABASE.dialect,
    logging: DATABASE.logging,
    timezone: DATABASE.timezone,
  },
);

module.exports = {
  DATABASE,
  development: DATABASE,
  test: DATABASE,
  production: DATABASE,
  sequelize,
};
