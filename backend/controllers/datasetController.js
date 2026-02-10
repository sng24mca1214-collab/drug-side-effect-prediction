const fs = require("fs");
const path = require("path");
const Dataset = require("../models/Dataset"); // ✅ ONLY ONCE

// 📤 Upload dataset
exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    await Dataset.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
    });

    res.json({ message: "Dataset uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// 📄 Get all datasets
exports.getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find().sort({ uploadedAt: -1 });
    res.json(datasets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
};

// 🗑 Delete dataset
exports.deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "datasets",
      dataset.storedName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Dataset.findByIdAndDelete(req.params.id);

    res.json({ message: "Dataset deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete dataset" });
  }
};
