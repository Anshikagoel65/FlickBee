const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  createCategory,
  getCategories,
  getActiveCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/active", getActiveCategories);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
