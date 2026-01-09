const Category = require("../models/Category");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      image: req.file.path,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CATEGORIES (ADMIN)
exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

// GET ACTIVE CATEGORIES (USER)
exports.getActiveCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  const { name, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Not found" });
  }

  category.name = name ?? category.name;
  category.isActive = isActive ?? category.isActive;

  if (req.file) {
    category.image = req.file.path;
  }

  await category.save();
  res.json(category);
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
