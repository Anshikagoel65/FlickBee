const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ADMIN (Vite)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
// DB Connection
connectDB();

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
