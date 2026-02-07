const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const auth = require("../middleware/authMiddleware"); // JWT middleware

// ➕ ADD ADDRESS
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      houseNo,
      street1,
      street2,
      city,
      state,
      postalCode,
      landmark,
      instructions,
      latitude,
      longitude,
      type,
      isDefault,
    } = req.body;

    // Ensure only one default address
    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user._id,

      name,
      phone,

      houseNo,
      street1,
      street2,

      city,
      state,
      postalCode,

      landmark,
      instructions,

      latitude,
      longitude,

      type: type || "home",
      isDefault: isDefault || false,
    });
    console.log("REQ BODY:", req.body);

    res.status(201).json(address);
  } catch (err) {
    console.error("❌ ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📥 GET ADDRESSES
router.get("/", auth, async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.user._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json(addresses);
  } catch (err) {
    console.error("❌ GET ADDRESS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✏️ UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      houseNo,
      street1,
      street2,
      city,
      state,
      postalCode,
      landmark,
      instructions,
      latitude,
      longitude,
      type,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name,
        phone,
        houseNo,
        street1,
        street2,
        city,
        state,
        postalCode,
        landmark,
        instructions,
        latitude,
        longitude,
        type,
        isDefault,
      },
      { new: true },
    );

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
