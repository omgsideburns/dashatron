//  NEWS API HANDLER
//  Uses NewsAPI.org.
//  Settings are in config.JS

const express = require("express");
const axios = require("axios");
const config = require("../../config");

const router = express.Router();
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.NEWS_API_KEY}`;

let cachedNews = [];
let lastFetched = 0;
const REFRESH_INTERVAL = config.REFRESH_INTERVALS.news;

router.get("/", (req, res) => {
  if (cachedNews.length > 0) {
    res.json(cachedNews);
  } else {
    res.status(503).json({ error: "News data not yet available." });
  }
});

async function refreshNews() {
  try {
    const response = await axios.get(NEWS_API_URL);
    cachedNews = response.data.articles.map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: a.source?.name || "",
      content: a.content,
    }));
    lastFetched = Date.now();
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

refreshNews(); // initial load
setInterval(refreshNews, REFRESH_INTERVAL);

module.exports = router;