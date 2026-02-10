const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
  username: String,
  drug: String,
  risk: String,
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SearchLog", searchLogSchema);
