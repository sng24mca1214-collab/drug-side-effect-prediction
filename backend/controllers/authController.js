const User = require("../models/User");

// ===============================
// REGISTER (USER ONLY)
// ===============================
exports.register = async (req, res) => {
  try {
    let { username, password } = req.body;

    // basic validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    username = username.trim();

    // ❌ block admin registration
    if (username.toLowerCase() === "admin") {
      return res.status(403).json({
        error: "Admin account cannot be registered",
      });
    }

    // ❌ check duplicate
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    // ✅ create normal user
    await User.create({
      username,
      password, // (plain for now – hashing later)
      role: "user",
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ===============================
// LOGIN (ADMIN + USER)
// ===============================
exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    username = username.trim();

    // ✅ FIXED ADMIN LOGIN
    if (username === "admin" && password === "admin123") {
      return res.json({
        role: "admin",
        username: "admin",
      });
    }

    // ✅ USER LOGIN
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // ✅ IMPORTANT: send BOTH role + username
    res.json({
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
