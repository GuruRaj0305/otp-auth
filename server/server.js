require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/models/index.model"); 

const createDummyUsers = require("./src/util/dummy-user");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync();
    console.log("Database tables synced successfully.");

    await createDummyUsers();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();

