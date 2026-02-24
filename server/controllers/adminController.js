const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Orders");
const Address = require("../models/Address");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ADMIN LOGIN
exports.changePassword = async (req, res) => {
  try {
    const adminId = req.user.id; // from middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      // Join orders
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },

      // Calculate totals
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.grandTotal" },
        },
      },

      // Select fields
      {
        $project: {
          phone: 1,
          createdAt: 1,
          totalOrders: 1,
          totalSpent: 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "phone")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update current status
    order.currentStatus = status;

    // Push into status timeline
    order.statusTimeline.push({
      status,
      time: new Date(),
      note: "Updated by admin",
    });

    await order.save();

    res.json({ message: "Status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update payment status
    order.payment.status = status;

    // Push to timeline
    order.statusTimeline.push({
      status: `payment-${status}`,
      time: new Date(),
      note: "Payment updated by admin",
    });

    await order.save();

    res.json({ message: "Payment status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
