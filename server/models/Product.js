const mongoose = require("mongoose");

/* LOGICAL GROUPING (NOT UI TEXT) */
const PRODUCT_TYPES = [
  "grocery",
  "snacks",
  "beverages",
  "dairy",
  "fruits",
  "vegetables",
  "grains",
  "others",
];

const UNIT_TYPES = ["gram", "kg", "ml", "liter", "piece"];
const PRODUCT_STATUS = ["active", "inactive", "outOfStock"];

/* STORE LEVEL INFO */
const storeProductInfoSchema = new mongoose.Schema(
  {
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    maxOrderQuantity: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    storePriceOverride: {
      type: Number,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    keywords: {
      type: [String],
      default: [],
      index: true,
    },

    /* UI CATEGORY (FROM CATEGORY COLLECTION) */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    /* LOGICAL GROUP (FOR FILTERS & ANALYTICS) */
    productType: {
      type: String,
      enum: PRODUCT_TYPES,
      required: true,
    },

    /* PRICING */
    price: {
      type: Number, // selling price
      required: true,
    },

    mrp: {
      type: Number,
      required: true,
    },

    taxPercent: {
      type: Number,
      default: 0,
    },

    /* VARIANTS */
    quantity: {
      type: [Number], // e.g. [500, 1000]
      required: true,
    },

    unit: {
      type: [String],
      enum: UNIT_TYPES,
      required: true,
    },

    /* OPTIONAL DETAILS */
    highlights: {
      type: Map,
      of: String,
    },

    keyDetails: {
      type: Map,
      of: String,
    },

    /* MEDIA */
    images: {
      type: [String],
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    /* AVAILABILITY */
    status: {
      type: String,
      enum: PRODUCT_STATUS,
      default: "active",
    },

    isCODAvailable: {
      type: Boolean,
      default: true,
    },

    isSubstitutable: {
      type: Boolean,
      default: true,
    },

    /* COMPLIANCE */
    isVegetarian: {
      type: Boolean,
      default: true,
    },

    isFragile: {
      type: Boolean,
      default: false,
    },

    isAgeRestricted: {
      type: Boolean,
      default: false,
    },

    /* RATINGS */
    averageRating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    /* STORE LEVEL DATA */
    storeInfo: {
      type: Map,
      of: storeProductInfoSchema,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
