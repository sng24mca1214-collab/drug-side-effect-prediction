const User = require("../models/User");
const SearchLog = require("../models/SearchLog");

// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

// Get search logs
exports.getSearchLogs = async (req, res) => {
  const logs = await SearchLog.find().sort({ searchedAt: -1 });
  res.json(logs);
};

// System status
exports.getStatus = (req, res) => {
  res.json({
    backend: "Running",
    ml_api: "Connected",
    database: "Connected",
  });
};
// Delete user by ID (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
