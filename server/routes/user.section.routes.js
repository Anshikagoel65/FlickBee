const express = require("express");
const router = express.Router();
const Section = require("../../models/section");

// /api/sections
router.get("/", async (req, res) => {
  const sections = await Section.find({ isActive: true })
    .sort({ order: 1 })
    .populate("category")
    .populate("products");

  res.json(sections);
});

module.exports = router;
