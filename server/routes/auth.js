const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const client = require("../config/twilio");
const User = require("../models/User");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(phone) {
  if (!phone) return phone;
  return phone.startsWith("+") ? phone : `+91${phone}`;
}

router.post("/send-otp", async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    phone = normalizePhone(phone);
    const otp = generateOTP();
    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await client.messages.create({
      body: `Your OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR 👉", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    let { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    phone = normalizePhone(phone);
    otp = otp.toString();

    const record = await Otp.findOne({ phone, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ phone });
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await Otp.deleteMany({ phone });

    res.json({
      message: "Login successful",
      token,
      phone: user.phone,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR 👉", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;
