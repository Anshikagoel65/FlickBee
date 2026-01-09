const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const {
  addProduct,
  updateProduct,
} = require("../controllers/product.controller");
const upload = require("../config/multer");
const Category = require("../models/Category");
const Section = require("../models/section");
const Product = require("../models/Product");

/* CREATE PRODUCT */
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      category,
      image: req.file ? `/uploads/products/${req.file.filename}` : "",
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
});

/* GET PRODUCTS (OPTIONAL CATEGORY FILTER) */
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;

    const updateData = {
      name,
      price,
      quantity,
      category,
    };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete image from uploads folder
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

router.post("/categories", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const category = await Category.create({
      name,
      image: `/uploads/categories/${req.file.filename}`,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err); // 👈 IMPORTANT
    res.status(500).json({ message: err.message });
  }
});

// GET ALL CATEGORIES (ADMIN)
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE CATEGORY
router.put("/categories/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name ?? category.name;

    if (req.file) {
      category.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE CATEGORY
router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/sections", async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("category")
      .populate("products");
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE section
router.post("/sections", async (req, res) => {
  try {
    const { title, category } = req.body;

    const section = await Section.create({
      title,
      category,
    });

    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE section
router.delete("/sections/:id", async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.put("/sections/:id", async (req, res) => {
  try {
    const { title, category, products } = req.body;

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { title, category, products },
      { new: true }
    );

    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
