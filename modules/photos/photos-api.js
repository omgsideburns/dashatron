// photo gallery

const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

const router = express.Router();
const photoDir = path.join(__dirname, "..", "..", config.UPLOAD_DIR);

router.get("/", (req, res) => {
  fs.readdir(photoDir, (err, files) => {
    if (err) {
      console.error("Error reading photo directory:", err);
      return res.status(500).json({ error: "Unable to read photo directory" });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(images);
  });
});

module.exports = router;