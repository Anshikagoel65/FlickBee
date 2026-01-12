const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const categories = [
  { name: "Grocery", slug: "grocery", image: "grocery.png", order: 1 },
  {
    name: "Biscuits & Cookies",
    slug: "biscuits-cookies",
    image: "biscuits.png",
    order: 2,
  },
  {
    name: "Instant Food (Midnight cravings)",
    slug: "instant-food",
    image: "instant.png",
    order: 3,
  },
  {
    name: "Namkeen & Popcorn",
    slug: "namkeen-popcorn",
    image: "namkeen.png",
    order: 4,
  },
  { name: "Chips", slug: "chips", image: "chips.png", order: 5 },
  {
    name: "Flavoured Milk & Dairy Drinks",
    slug: "dairy-drinks",
    image: "dairy.png",
    order: 6,
  },
  {
    name: "Juices & Fruit Drinks",
    slug: "juice-drinks",
    image: "juice.png",
    order: 7,
  },
  { name: "Dal & Rice", slug: "dal-rice", image: "dal.png", order: 8 },
  { name: "Fresh Fruits", slug: "fresh-fruits", image: "fruits.png", order: 9 },
  {
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    image: "vegetables.png",
    order: 10,
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log("✅ Categories seeded successfully");
  process.exit();
})();
