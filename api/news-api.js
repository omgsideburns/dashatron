//  NEWS API HANDLER
//  Uses NewsAPI.org.
//  Settings are in config.JS

const express = require("express");
const axios = require("axios");
const config = require("../config");

const router = express.Router();
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.NEWS_API_KEY}`;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(NEWS_API_URL);
    const articles = response.data.articles.map(a => ({
      title: a.title,
      url: a.url
    }));
    res.json(articles);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;