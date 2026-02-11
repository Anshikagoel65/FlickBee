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

const allowedOrigins = [
  "http://flickbee-user.s3-website-us-east-1.amazonaws.com",
  "https://flickbees.in",
  "https://www.flickbees.in",
  "https://flickbees.com",
  "https://www.flickbees.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", userRoutes);

/* DB */
connectDB();

/* SERVER */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
