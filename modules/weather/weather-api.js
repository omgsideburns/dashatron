const express = require("express");
const axios = require("axios");
const config = require("../../config");


const router = express.Router();

// Set your coordinates here (Decimal degrees)
const LAT = config.WEATHER_LAT;
const LON = config.WEATHER_LON;

const WEATHER_SETTINGS = config.MODULE_DEFAULTS.weather;

// Cache the forecast grid data so we don’t fetch it every time
let cachedGrid = null;

// Request and refresh logic
let cachedWeather = null;
let lastFetched = 0;
const REFRESH_INTERVAL = WEATHER_SETTINGS.refreshInterval;

async function refreshWeather() {
  try {
    if (!cachedGrid) {
      const pointsUrl = `https://api.weather.gov/points/${LAT},${LON}`;
      const pointsRes = await axios.get(pointsUrl, {
        headers: { "User-Agent": `DashatronApp (${config.USER_EMAIL})` }
      });
      cachedGrid = pointsRes.data.properties;
    }

    const forecastUrl = cachedGrid.forecast;
    const forecastRes = await axios.get(forecastUrl, {
      headers: { "User-Agent": `DashatronApp (${config.USER_EMAIL})` }
    });

    const hourlyUrl = cachedGrid.forecastHourly;
    const hourlyRes = await axios.get(hourlyUrl, {
      headers: { "User-Agent": `DashatronApp (${config.USER_EMAIL})` }
    });

    const allPeriods = forecastRes.data.properties.periods;
    const allHourly = hourlyRes.data.properties.periods;

    cachedWeather = {
      current: {
        temp: allHourly[0].temperature,
        condition: allHourly[0].shortForecast,
        wind: `${allHourly[0].windSpeed} ${allHourly[0].windDirection}`,
        icon: allHourly[0].icon
      },
      hourly: allHourly.slice(0, WEATHER_SETTINGS.hourlyLimit).map(p => ({
        time: p.startTime,
        temp: p.temperature,
        unit: p.temperatureUnit,
        condition: p.shortForecast,
        icon: p.icon
      })),
      fiveDay: allPeriods.filter(p => p.isDaytime).slice(0, WEATHER_SETTINGS.dailyLimit).map(p => ({
        name: p.name,
        temp: `${p.temperature}°${p.temperatureUnit}`,
        condition: p.shortForecast,
        wind: `${p.windSpeed} ${p.windDirection}`,
        icon: p.icon,
        detailed: p.detailedForecast
      })),
      raw: {
        forecast: allPeriods,
        hourly: allHourly
      }
    };

    lastFetched = Date.now();
  } catch (err) {
    console.error("Failed to refresh weather:", err);
  }
}

refreshWeather(); // initial fetch
setInterval(refreshWeather, REFRESH_INTERVAL);

// Route handler for GET /api/weather
router.get("/", async (req, res) => {
  res.json(cachedWeather || { error: "Weather data not available yet." });
});

module.exports = router;