const express = require("express");
const axios = require("axios");
const config = require("../config");


const router = express.Router();

// Set your coordinates here (Decimal degrees)
const LAT = config.WEATHER_LAT;
const LON = config.WEATHER_LON;

// Cache the forecast grid data so we don’t fetch it every time
let cachedGrid = null;

// Route handler for GET /api/weather
router.get("/", async (req, res) => {
  try {
    // Fetch grid and forecast endpoint metadata from NWS
    if (!cachedGrid) {
      const pointsUrl = `https://api.weather.gov/points/${LAT},${LON}`;
      const pointsRes = await axios.get(pointsUrl, {
        headers: { "User-Agent": `DashyApp (${config.USER_EMAIL})` } // NWS requires User-Agent
      });
      cachedGrid = pointsRes.data.properties;
    }

    // Fetch actual forecast data from the cached forecast URL
    const forecastUrl = cachedGrid.forecast;
    const forecastRes = await axios.get(forecastUrl, {
      headers: { "User-Agent": `DashyApp (${config.USER_EMAIL})` } // NWS requires User-Agent
    });

    const hourlyUrl = cachedGrid.forecastHourly;
    const hourlyRes = await axios.get(hourlyUrl, {
      headers: { "User-Agent": `DashyApp (${config.USER_EMAIL})` } // NWS requires User-Agent
    });

    const allPeriods = forecastRes.data.properties.periods;
    const allHourly = hourlyRes.data.properties.periods;

    res.json({
      current: {
        temp: allPeriods[0].temperature,
        condition: allPeriods[0].shortForecast,
        wind: `${allPeriods[0].windSpeed} ${allPeriods[0].windDirection}`,
        icon: allPeriods[0].icon
      },
      hourly: allHourly.slice(0, 12).map(p => ({
        time: p.startTime,
        temp: p.temperature,
        unit: p.temperatureUnit,
        condition: p.shortForecast,
        icon: p.icon
      })),
      fiveDay: allPeriods.filter(p => p.isDaytime).slice(0, 5).map(p => ({
        name: p.name,
        temp: `${p.temperature}°${p.temperatureUnit}`,
        condition: p.shortForecast,
        wind: `${p.windSpeed} ${p.windDirection}`,
        icon: p.icon,
        detailed: p.detailedForecast
      }))
    });
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    res.status(500).json({ error: "Unable to load weather" });
  }
});

module.exports = router;