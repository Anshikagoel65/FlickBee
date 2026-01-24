const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Product = require("../models/Product");
const Section = require("../models/section");

/* USER: Categories */
router.get("/categories", async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

/* USER: Products */
router.get("/products", async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
});

/* USER: Sections */
router.get("/sections", async (req, res) => {
  const sections = await Section.find({ isActive: true })
    .sort({ order: 1 })
    .populate("category")
    .populate("products");

  res.json(sections);
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
