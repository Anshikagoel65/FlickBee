const Product = require("../models/Product");

// ADMIN: add product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create product",
      error: err.message,
    });
  }
};

// ADMIN: update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update product",
      error: err.message,
    });
  }
};

// USER: get products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    }).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      status: "active",
    }).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const products = await Product.find({
      productType: req.params.type,
      status: "active",
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
