//  NEWS API HANDLER
//  Uses NewsAPI.org.
//  Settings are in config.JS

const express = require("express");
const axios = require("axios");
const config = require("../../config");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const NEWS_SETTINGS = config.MODULE_DEFAULTS.news;
const REFRESH_INTERVAL = NEWS_SETTINGS.refreshInterval;
const CACHE_FILE = path.join(__dirname, "news-cache.json");

let queryParams = [];

if (Array.isArray(NEWS_SETTINGS.sources) && NEWS_SETTINGS.sources.length > 0) {
  queryParams.push(`sources=${NEWS_SETTINGS.sources.join(",")}`);
} else {
  queryParams.push(`country=${NEWS_SETTINGS.country}`);
  if (NEWS_SETTINGS.category) {
    queryParams.push(`category=${NEWS_SETTINGS.category}`);
  }
}

queryParams.push(`pageSize=${NEWS_SETTINGS.maxItems}`);
queryParams.push(`apiKey=${config.NEWS_API_KEY}`);

const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?${queryParams.join("&")}`;

let cachedNews = [];
let lastFetched = 0;

if (fs.existsSync(CACHE_FILE)) {
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    cachedNews = JSON.parse(raw);
    lastFetched = Date.now();
  } catch (err) {
    console.error("Failed to load news cache:", err);
  }
}

router.get("/", async (req, res) => {
  const now = Date.now();
  if (now - lastFetched > REFRESH_INTERVAL) {
    await refreshNews();
  }

  if (cachedNews.length > 0) {
    res.json(cachedNews);
  } else {
    res.status(503).json({ error: "News data not yet available." });
  }
});

async function refreshNews() {
  try {
    const response = await axios.get(NEWS_API_URL);
    if (response.status === 200 && response.data.status === "ok") {
      cachedNews = response.data.articles.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        urlToImage: a.urlToImage,
        publishedAt: a.publishedAt,
        source: a.source?.name || "",
        content: a.content?.split(" [+")[0] || "",
      }));
      lastFetched = Date.now();
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cachedNews), "utf8");
    } else {
      console.warn("Unexpected News API response status:", response.data.status);
    }
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn("Hit NewsAPI rate limit. Retaining existing cache.");
      lastFetched = Date.now(); // still honor the interval
    } else {
      console.error("Error fetching news:", err.message || err);
    }
  }
}

refreshNews(); // initial load
// setInterval(refreshNews, REFRESH_INTERVAL);

module.exports = router;