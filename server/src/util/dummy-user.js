const { sequelize, User } = require("../models/index.model");

const createDummyUsers = async () => {
  const userCount = await User.count();

  if (userCount > 0) {
    console.log("Users already exist. Skipping dummy user creation.");
    return;
  }

  await User.bulkCreate([
    {
      name: "Test User 3",
      emailId: "user3@gmail.com",
      phoneNumber: "9876543210",
      gender: "male",
    },
    {
      name: "Test User One",
      emailId: "user1@gmail.com",
      phoneNumber: "9876543211",
      gender: "male",
    },
    {
      name: "Test User Two",
      emailId: "user2@gmail.com",
      phoneNumber: "9876543212",
      gender: "female",
    },
  ]);

  console.log("3 dummy users created successfully.");
};


module.exports = createDummyUsers;