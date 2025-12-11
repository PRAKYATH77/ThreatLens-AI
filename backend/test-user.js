require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const testUserEmail = "browser@test.com";
const testUserPassword = "password123";

const setupTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUserEmail });
    if (existingUser) {
      console.log(`✅ User ${testUserEmail} already exists`);
      console.log("   ID:", existingUser._id);
      console.log("   Username:", existingUser.username);
      process.exit(0);
    }

    // Create the test user
    const hashedPassword = await bcrypt.hash(testUserPassword, 10);
    const newUser = await User.create({
      username: "browser_user",
      email: testUserEmail,
      password: hashedPassword,
      role: "Developer",
    });

    console.log("✅ Test user created successfully!");
    console.log("   Email:", newUser.email);
    console.log("   Username:", newUser.username);
    console.log("   ID:", newUser._id);
    console.log("\n📝 Use these credentials to login:");
    console.log(`   Email: ${testUserEmail}`);
    console.log(`   Password: ${testUserPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setupTestUser();
