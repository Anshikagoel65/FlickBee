const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/address.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

/* 🔥 STATIC FIRST */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* 🔥 THEN CORS */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/admin", adminRoutes); // 🔴 ADMIN
app.use("/api", userRoutes); // 🔵 USER
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);

/* DB */
connectDB();

/* SERVER */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
