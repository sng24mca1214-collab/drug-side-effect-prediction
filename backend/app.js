const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const drugRoutes = require("./routes/drugRoutes");
const adminRoutes = require("./routes/adminRoutes");
const datasetRoutes = require("./routes/datasetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/drug", drugRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/datasets", datasetRoutes);

app.get("/", (req, res) => {
  res.send("Backend API running");
});

module.exports = app;
