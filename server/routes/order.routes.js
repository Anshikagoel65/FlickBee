const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      addressId,
      items,
      itemTotal,
      taxAmount,
      deliveryFee,
      discount,
      grandTotal,
      payment,
    } = req.body;

    if (!payment || !payment.method) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      let variant = null;

      if (item.variantId && product.variants?.length) {
        variant = product.variants.id(item.variantId);
      }

      if (!variant && product.variants?.length) {
        variant = product.variants[0];
      }

      if (!variant) {
        return res.status(404).json({
          message: "Variant not found",
        });
      }

      const orderQty = item.count || item.quantity || 1;

      if (variant.stock <= 0) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      if (variant.stock < orderQty) {
        return res.status(400).json({
          message: `Requested quantity of ${product.name} is not available`,
        });
      }

      variant.stock -= orderQty;

      product.isAvailable = product.variants.some((v) => v.stock > 0);

      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      storeId: "default-store",
      addressId,
      items,
      itemTotal,
      taxAmount,
      deliveryFee,
      discount,
      grandTotal,

      payment: {
        method: payment.method,
        status:
          payment.status || (payment.method === "cod" ? "pending" : "success"),
        transactionId: payment.transactionId || null,
        amountPaid: payment.amountPaid || grandTotal,
        paidAt:
          payment.method !== "cod" && payment.status === "success"
            ? new Date()
            : null,
      },

      delivery: {},

      currentStatus: "placed",
      statusTimeline: [
        {
          status: "placed",
          time: new Date(),
        },
      ],
    });

    if (global.io) {
      global.io.emit("new-order", {
        orderId: order._id,
        total: order.grandTotal,
        userId: order.userId,
      });
    }
    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ userId: req.user._id });
    if (!orders.length) {
      return res.json([]);
    }

    const orderedProductIds = new Set();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId) {
          orderedProductIds.add(item.productId.toString());
        }
      });
    });

    const recommendations = await Product.find({
      _id: { $nin: Array.from(orderedProductIds) },
      status: "active",
    }).limit(10);
    res.json(recommendations);
  } catch (err) {
    console.error("RECOMMENDATION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("addressId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
