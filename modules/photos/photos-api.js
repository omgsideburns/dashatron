// photo gallery

const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

const router = express.Router();
const photoDir = path.join(__dirname, "..", "..", config.UPLOAD_DIR);
const PHOTO_SETTINGS = config.MODULE_DEFAULTS.photos;

router.get("/", (req, res) => {
  fs.readdir(photoDir, (err, files) => {
    if (err) {
      console.error("Error reading photo directory:", err);
      return res.status(500).json({ error: "Unable to read photo directory" });
    }
    let images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    if (PHOTO_SETTINGS.shuffle) {
      images.sort(() => Math.random() - 0.5);
    }

    if (PHOTO_SETTINGS.maxItems) {
      images = images.slice(0, PHOTO_SETTINGS.maxItems);
    }

    res.json(images);
  });
});

module.exports = router;