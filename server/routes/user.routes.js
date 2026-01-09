const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Section = require("../models/section");

router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/sections", async (req, res) => {
  const sections = await Section.find({ isActive: true })
    .sort({ order: 1 })
    .populate("category")
    .populate("products");

  res.json(sections);
});

module.exports = router;
