const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// 🔗 MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://sng24mca1214_db_user:ashikl%40123@cluster0.bytupxz.mongodb.net/drugDB?retryWrites=true&w=majority";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const exists = await User.findOne({ username: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "admin",
      password: hashed,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
