const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 🔥 detect route
    if (req.originalUrl.includes("products")) {
      cb(null, "uploads/products");
    } else if (req.originalUrl.includes("categories")) {
      cb(null, "uploads/categories");
    } else {
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  },
});

module.exports = upload;
