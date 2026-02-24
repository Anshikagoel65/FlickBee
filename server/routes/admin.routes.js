const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const cors = require("cors");

const Category = require("../models/Category");
const Product = require("../models/Product");
const Section = require("../models/section");

const {
  addProduct,
  updateProduct,
  getAdminProducts,
} = require("../controllers/product.controller");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  adminLogin,
  changePassword,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrdersCount,
} = require("../controllers/adminController");

router.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
// ADMIN LOGIN ROUTE
router.post("/login", adminLogin);
router.put("/change-password", authMiddleware, adminMiddleware, changePassword);

/* ================= CATEGORIES ================= */

router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const category = await Category.create({
      name: req.body.name,
      image: `/uploads/categories/${req.file.filename}`,
      isActive: true,
    });
    res.status(201).json(category);
  },
);

router.get("/categories", authMiddleware, adminMiddleware, async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

router.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const category = await Category.findById(req.params.id);
    category.name = req.body.name ?? category.name;
    if (req.file) category.image = `/uploads/categories/${req.file.filename}`;
    await category.save();
    res.json(category);
  },
);

router.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  },
);

/* ================= PRODUCTS ================= */

router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  addProduct,
);

router.get("/products", authMiddleware, adminMiddleware, getAdminProducts);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProduct,
);

router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  },
);

/* ================= SECTIONS ================= */

router.get("/sections", authMiddleware, adminMiddleware, async (req, res) => {
  const sections = await Section.find()
    .populate("category")
    .populate("products");
  res.json(sections);
});

router.post("/sections", authMiddleware, adminMiddleware, async (req, res) => {
  const section = await Section.create(req.body);
  res.status(201).json(section);
});

router.put(
  "/sections/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(section);
  },
);

router.delete(
  "/sections/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  },
);

router.get("/orders-count", getOrdersCount);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus,
);
router.put(
  "/orders/:id/payment-status",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus,
);

module.exports = router;
