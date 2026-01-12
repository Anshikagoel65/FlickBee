const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // "Biscuits & Cookies"
    },

    slug: {
      type: String,
      required: true,
      unique: true, // biscuits-cookies
    },

    image: {
      type: String, // category image URL
      required: true,
    },

    order: {
      type: Number, // for sorting on UI
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
