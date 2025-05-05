const express = require("express");
const multer = require("multer");
const path = require("path");
const config = require("../config");

const router = express.Router();

const uploadFolder = path.join(__dirname, "..", config.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});

const upload = multer({ storage });

router.post("/", upload.array("photos"), (req, res) => {
  if (req.files && req.files.length > 0) {
    res.json({ files: req.files.map(f => f.filename) });
  } else {
    res.status(400).json({ error: "No files uploaded." });
  }
});

module.exports = router;