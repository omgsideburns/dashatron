require("dotenv").config();

module.exports = {
  PORT: 3000,

  // User Info
  USER_EMAIL: process.env.USER_EMAIL,

  // Calendar
  CALENDAR_URLS: process.env.CALENDAR_URLS
  ? process.env.CALENDAR_URLS.split(",")
  : [],

  CUTOFF_DAYS: 14,

  // NWS Weather API
  WEATHER_LAT: process.env.WEATHER_LAT,
  WEATHER_LON: process.env.WEATHER_LON,

  // News
  NEWS_API_KEY: process.env.NEWS_API_KEY,

  // Photo Uploader
  UPLOAD_DIR: "uploads",

  // Set your refresh intervals for each API
  REFRESH_INTERVALS: {
    calendar: 5 * 60 * 1000,  // 5 minutes
    news: 10 * 60 * 1000,     // 10 minutes
    weather: 15 * 60 * 1000   // 15 minutes
  }
};