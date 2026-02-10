const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  storedName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Dataset", datasetSchema);
