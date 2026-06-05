const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;