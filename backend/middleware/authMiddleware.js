module.exports = (req, res, next) => {
  const username = req.headers["x-username"];
  const role = req.headers["x-role"];

  if (!username || !role) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = { username, role };
  next();
};
