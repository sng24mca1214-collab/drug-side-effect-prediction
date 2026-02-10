const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const datasetController = require("../controllers/datasetController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "datasets"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("dataset"), datasetController.uploadDataset);
router.get("/", datasetController.getDatasets);
router.delete("/:id", datasetController.deleteDataset);

module.exports = router;
