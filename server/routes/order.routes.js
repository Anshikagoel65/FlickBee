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

    // 1️⃣ Fetch user orders
    const orders = await Order.find({ userId: req.user._id });

    if (!orders.length) {
      return res.json([]);
    }

    // 2️⃣ Collect ordered product IDs
    const orderedProductIds = new Set();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId) {
          orderedProductIds.add(item.productId.toString());
        }
      });
    });

    // 3️⃣ Fetch products not already ordered
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
