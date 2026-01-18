const Product = require("../models/Product");

// ADMIN: add product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      productType,
      price,
      mrp,
      quantity,
      unit,
    } = req.body;

    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "Images are required" });
    }

    const images = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const product = await Product.create({
      name,
      description,
      category,
      productType,
      price,
      mrp,
      quantity: JSON.parse(quantity),
      unit: JSON.parse(unit),
      images,
      thumbnail: images[0],
      status: "active",
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: update product
exports.updateProduct = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILES:", req.files);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      category,
      productType,
      price,
      mrp,
      quantity,
      unit,
      status,
    } = req.body;

    // basic fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (productType !== undefined) product.productType = productType;
    if (price !== undefined) product.price = price;
    if (mrp !== undefined) product.mrp = mrp;
    if (status !== undefined) product.status = status;

    // ✅ SAFE parsing
    if (quantity !== undefined) {
      product.quantity = Array.isArray(quantity)
        ? quantity
        : JSON.parse(quantity);
    }

    if (unit !== undefined) {
      product.unit = Array.isArray(unit) ? unit : JSON.parse(unit);
    }

    // ✅ images only if uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
      product.images = images;
      product.thumbnail = images[0];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Update product failed",
      error: err.message,
    });
  }
};

// ADMIN: get all products
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category"); // ✅ IMPORTANT

    res.json(products);
  } catch (err) {
    console.error("GET ADMIN PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message });
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
    const products = await Product.find({ status: "active" }).populate(
      "category"
    );

    const grouped = {};

    products.forEach((product) => {
      if (!product.category) return;

      const catId = product.category._id.toString();

      if (!grouped[catId]) {
        grouped[catId] = {
          category: product.category,
          products: [],
        };
      }

      grouped[catId].products.push(product);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("GROUP BY CATEGORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
