const express = require("express");
const router = express.Router();
const admin = require("../config/firebase"); // firebase-admin init
const User = require("../models/User");

router.post("/firebase-login", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }
    const firebaseToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const phone = decoded.phone_number;
    if (!phone) {
      return res.status(400).json({ message: "Phone not found in token" });
    }
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    return res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
});

module.exports = router;
