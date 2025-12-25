const express = require("express");
const router = express.Router();
const {
  addProduct,
  updateProduct,
} = require("../controllers/product.controller");

router.post("/product", addProduct);
router.put("/product/:id", updateProduct);

module.exports = router;
