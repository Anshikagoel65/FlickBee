const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const existingAdmin = await Admin.findOne({ email: "admin@flickbee.com" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    name: "Flickbees",
    email: "admin@flickbee.com",
    password: hashedPassword,
  });

  console.log("Admin Created Successfully");
  process.exit();
}

createAdmin();
