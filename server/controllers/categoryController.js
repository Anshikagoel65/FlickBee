const Category = require("../models/Category");

const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

exports.createCategory = async (req, res) => {
  try {
    const { name, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const slug = generateSlug(name);

    const category = await Category.create({
      name,
      slug,
      order: order || 0,
      image: `/uploads/categories/${req.file.filename}`,
      isActive: true,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

exports.getActiveCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, order } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = generateSlug(name);
    }

    if (order !== undefined) {
      category.order = order;
    }

    if (req.file) {
      category.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
