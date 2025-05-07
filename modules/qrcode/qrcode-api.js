// generates a qr code to the photo uploader.
// this is actually in the server.js so this 
// file is serving as a placeholder until
// i make this modular... boo.
// css - dashatron.css
// js - server.js
// not sure if i should put this into the uploader js..

const express = require ("express");
const router = express.Router();
const QRCode = require("qrcode");

router.get("/", async (req, res) => {
  const url = `${req.protocol}://${req.get("host")}/upload.html`;
  try {
    const qr = await QRCode.toDataURL(url);
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;