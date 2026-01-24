const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  mrp: Number,
  quantity: Number,
  unit: String,
  count: Number,
  image: String,
  isSubstituted: { type: Boolean, default: false },
  substitutedWithProductId: String,
});

const PaymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["cod", "upi", "card"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    required: true,
  },
  transactionId: String,
  amountPaid: Number,
  paidAt: Date,
});

const DeliveryInfoSchema = new mongoose.Schema({
  partnerId: String,
  partnerName: String,
  partnerPhone: String,
  assignedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  distanceKm: Number,
  deliveryFee: Number,
});

const OrderStatusLogSchema = new mongoose.Schema({
  status: String,
  time: Date,
  note: String,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storeId: String,
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

    items: [OrderItemSchema],

    itemTotal: Number,
    taxAmount: Number,
    deliveryFee: Number,
    discount: Number,
    otherCharges: Object,
    grandTotal: Number,

    payment: PaymentInfoSchema,
    delivery: DeliveryInfoSchema,

    currentStatus: {
      type: String,
      enum: [
        "placed",
        "acceptedByStore",
        "packing",
        "packed",
        "assignedToDelivery",
        "outForDelivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "placed",
    },

    statusTimeline: [OrderStatusLogSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);
