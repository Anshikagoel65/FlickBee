const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/address.routes");
const orderRoutes = require("./routes/order.routes");
const bannerRoutes = require("./routes/banner.routes");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
  "https://flickbees.in",
  "https://www.flickbees.in",
  "https://flickbees.com",
  "https://www.flickbees.com",
  "https://admin.flickbees.in",
  "http://localhost:3000",
  "http://localhost:5173",
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
app.use("/api/banners", bannerRoutes);

connectDB();

const PORT = 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
