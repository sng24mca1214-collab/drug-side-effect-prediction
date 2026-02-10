const express = require("express");
const router = express.Router();

const {
  predictDrug,
  getUserHistory,
} = require("../controllers/drugController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * 🔍 Predict drug side effects
 * Accessible by logged-in users
 * GET /api/drug/predict?drug=Aspirin
 */
router.get("/predict", authMiddleware, predictDrug);

/**
 * 📜 Get logged-in user's drug search history
 * GET /api/drug/history
 */
router.get("/history", authMiddleware, getUserHistory);

module.exports = router;
