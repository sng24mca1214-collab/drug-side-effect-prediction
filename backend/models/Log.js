const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: { type: String, required: true },
  drug: { type: String, required: true },
  risk: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
