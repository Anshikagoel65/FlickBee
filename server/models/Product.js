const mongoose = require("mongoose");

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

/* ===============================
   STORE VARIANT INFO
================================ */

const storeVariantSchema = new mongoose.Schema(
  {
    stock: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    storePriceOverride: { type: Number, min: 0 },
  },
  { _id: false },
);

/* ===============================
   VARIANT SCHEMA
================================ */

const variantSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    unit: { type: String, enum: UNIT_TYPES, required: true },

    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },

    sku: { type: String }, // optional

    stock: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },

    storeInfo: {
      type: Map,
      of: storeVariantSchema,
      default: {},
    },
  },
  { _id: true },
);

/* ===============================
   MAIN PRODUCT SCHEMA
================================ */

const productSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brandName: { type: String, default: "FlickBee" },

    keywords: { type: [String], default: [], index: true },

    /* CATEGORY */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    productType: {
      type: String,
      enum: PRODUCT_TYPES,
      required: true,
      index: true,
    },

    /* TAX */
    taxPercent: { type: Number, default: 0, min: 0 },

    /* VARIANTS */
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one variant required",
      },
    },

    /* OPTIONAL DETAILS */
    highlights: { type: Map, of: String },
    keyDetails: { type: Map, of: String },

    /* MEDIA */
    images: {
      type: [String],
      required: true,
      validate: (v) => v.length > 0,
    },

    thumbnail: { type: String },

    /* PRODUCT STATUS */
    status: {
      type: String,
      enum: PRODUCT_STATUS,
      default: "active",
      index: true,
    },

    isCODAvailable: { type: Boolean, default: true },
    isSubstitutable: { type: Boolean, default: true },

    /* COMPLIANCE */
    isVegetarian: { type: Boolean, default: true },
    isFragile: { type: Boolean, default: false },
    isAgeRestricted: { type: Boolean, default: false },

    /* RATINGS */
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* ===============================
   VIRTUALS
================================ */
// Lowest price variant
productSchema.virtual("minPrice").get(function () {
  if (!Array.isArray(this.variants) || this.variants.length === 0) {
    return 0;
  }
  return Math.min(...this.variants.map((v) => v.price || 0));
});

// Overall availability
productSchema.virtual("isAvailable").get(function () {
  if (this.status === "outOfStock") return false;

  if (!Array.isArray(this.variants)) return false;

  return this.variants.some((v) => v && v.stock > 0 && v.isAvailable);
});

/* ===============================
   MIDDLEWARE
================================ */

productSchema.pre("save", function () {
  if (!this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
});

/* ===============================
   INDEXES
================================ */

productSchema.index({ name: "text", keywords: "text" });
productSchema.index({ category: 1, productType: 1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model("Product", productSchema);
