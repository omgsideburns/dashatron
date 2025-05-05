// Load core modules
const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
const config = require("./config");

// Initialize the Express app
const app = express();

// Serve static frontend files from the 'Public' directory
app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount modular route handlers
app.use("/api/calendar", require("./api/calendar-api")); // Calendar API route
app.use("/api/weather", require("./api/weather-api"));   // Weather API route
app.use("/api/news", require("./api/news-api")); // News API route
app.use("/upload", require("./api/uploader-api")); // Photo upload handler
app.use("/api/photos", require("./api/photos-api")); // Gallery handler

// Start the server
app.listen(config.PORT, () => {
  console.log(`Dashboard running at http://localhost:${config.PORT}`);
});