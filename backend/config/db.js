const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
  "mongodb+srv://drugadmin:drug12345@cluster0.bytupxz.mongodb.net/drug_side_effect_db?retryWrites=true&w=majority"
);



    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
