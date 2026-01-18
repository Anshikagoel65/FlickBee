const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const Category = require("../models/Category");
const Product = require("../models/Product");
const Section = require("../models/section");

const {
  addProduct,
  updateProduct,
  getAdminProducts,
} = require("../controllers/product.controller");

/* ================= CATEGORIES ================= */

// CREATE
router.post("/categories", upload.single("image"), async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    image: `/uploads/categories/${req.file.filename}`,
    isActive: true,
  });
  res.status(201).json(category);
});

// READ
router.get("/categories", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

// UPDATE
router.put("/categories/:id", upload.single("image"), async (req, res) => {
  const category = await Category.findById(req.params.id);
  category.name = req.body.name ?? category.name;
  if (req.file) category.image = `/uploads/categories/${req.file.filename}`;
  await category.save();
  res.json(category);
});

// DELETE
router.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= PRODUCTS ================= */

router.post("/products", upload.array("images", 5), addProduct);
router.get("/products", getAdminProducts);
router.put("/products/:id", upload.array("images", 5), updateProduct);
router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= SECTIONS ================= */

router.get("/sections", async (req, res) => {
  const sections = await Section.find()
    .populate("category")
    .populate("products");
  res.json(sections);
});

router.post("/sections", async (req, res) => {
  const section = await Section.create(req.body);
  res.status(201).json(section);
});

router.put("/sections/:id", async (req, res) => {
  const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(section);
});

router.delete("/sections/:id", async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
