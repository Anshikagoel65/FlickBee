const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/address.routes");

const app = express();

const path = require("path");
const allowedOrigins = [
  "http://localhost:3000", // USER app (LoginModal)
  "http://localhost:5173", // ADMIN portal (Vite)
];

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);

// DB Connection
connectDB();

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
