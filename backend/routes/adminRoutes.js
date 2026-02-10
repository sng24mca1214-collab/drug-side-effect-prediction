const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/users", adminController.getUsers);
router.get("/logs", adminController.getSearchLogs);
router.get("/status", adminController.getStatus);
router.delete("/users/:id", adminController.deleteUser);


module.exports = router;
