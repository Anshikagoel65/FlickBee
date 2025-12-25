const Product = require("../models/Product");

// ADMIN: add product
exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
};

// ADMIN: update product
exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// USER: get products
exports.getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
};
