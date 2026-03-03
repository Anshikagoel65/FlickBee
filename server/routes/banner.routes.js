const express = require("express");
const router = express.Router();
const multer = require("multer");
const Banner = require("../models/Banners");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("banner"), async (req, res) => {
  try {
    const banner = await Banner.create({
      image: req.file.filename,
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const filePath = path.join(__dirname, "../uploads", banner.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
