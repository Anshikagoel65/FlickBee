require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const categories = await Category.find();

    for (const cat of categories) {
      if (cat.image && !cat.image.startsWith("/uploads/categories/")) {
        cat.image = `/uploads/categories/${cat.image}`;
        await cat.save();
        console.log("Fixed:", cat.name, cat.image);
      }
    }

    console.log("All categories fixed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("DB error", err);
    process.exit(1);
  });
