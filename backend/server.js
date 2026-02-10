const app = require("./app");
const connectDB = require("./config/db");

const PORT = 3000;

// Connect DB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
