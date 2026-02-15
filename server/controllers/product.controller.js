const Product = require("../models/Product");

/* ================= ADMIN: ADD PRODUCT ================= */

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      productType,
      taxPercent,
      variants,
      status,
      isCODAvailable,
      isSubstitutable,
      isVegetarian,
      isFragile,
      isAgeRestricted,
      brandName,
      keywords,
    } = req.body;

    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "Images are required" });
    }

    if (!variants) {
      return res.status(400).json({ message: "Variants are required" });
    }

    const parsedVariants = JSON.parse(variants);

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: "At least one variant required" });
    }

    const images = req.files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    const product = await Product.create({
      name,
      description,
      category,
      productType,
      brandName,
      taxPercent: Number(taxPercent) || 0,
      variants: parsedVariants,
      images,
      thumbnail: images[0],
      status,
      isCODAvailable,
      isSubstitutable,
      isVegetarian,
      isFragile,
      isAgeRestricted,
      keywords: keywords ? JSON.parse(keywords) : [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN: UPDATE PRODUCT ================= */

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      category,
      productType,
      taxPercent,
      variants,
      status,
      isCODAvailable,
      isSubstitutable,
      isVegetarian,
      isFragile,
      isAgeRestricted,
      brandName,
      keywords,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (productType !== undefined) product.productType = productType;
    if (brandName !== undefined) product.brandName = brandName;
    if (taxPercent !== undefined) product.taxPercent = Number(taxPercent);

    if (status !== undefined) product.status = status;
    if (isCODAvailable !== undefined) product.isCODAvailable = isCODAvailable;
    if (isSubstitutable !== undefined)
      product.isSubstitutable = isSubstitutable;
    if (isVegetarian !== undefined) product.isVegetarian = isVegetarian;
    if (isFragile !== undefined) product.isFragile = isFragile;
    if (isAgeRestricted !== undefined)
      product.isAgeRestricted = isAgeRestricted;

    if (keywords !== undefined) {
      product.keywords = Array.isArray(keywords)
        ? keywords
        : JSON.parse(keywords);
    }

    if (variants !== undefined) {
      product.variants = Array.isArray(variants)
        ? variants
        : JSON.parse(variants);
    }

    // Update images if provided
    if (req.files && req.files.length > 0) {
      const images = req.files.map(
        (file) => `/uploads/products/${file.filename}`,
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

/* ================= ADMIN: GET ALL ================= */

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER: GET ACTIVE ================= */

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

/* ================= GROUP BY CATEGORY ================= */

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    }).populate("category");

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
    res.status(500).json({ message: err.message });
  }
};
