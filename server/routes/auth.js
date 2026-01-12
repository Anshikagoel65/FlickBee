const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const client = require("../config/twilio");
const User = require("../models/User");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/send-otp", async (req, res) => {
  console.log("🔥 /send-otp hit", req.body);
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

  const otp = generateOTP();

  try {
    // Delete old OTPs for this phone
    await Otp.deleteMany({ phone });

    // Save OTP in DB
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // Send SMS
    await client.messages.create({
      body: `Your OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const record = await Otp.findOne({ phone, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // ✅ CREATE OR FIND USER
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  const token = jwt.sign(
    { _id: user._id }, // MUST INCLUDE _id
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // cleanup OTP
  await Otp.deleteMany({ phone });

  res.json({
    message: "Login successful",
    token, // ✅ SEND TOKEN
    phone: user.phone, // ✅ SEND PHONE DIRECTLY
  });
});

module.exports = router;
