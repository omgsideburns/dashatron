require("dotenv").config();

module.exports = {
  PORT: 3000, // Pick a port.. any port.. for http

  UPLOAD_DIR: "uploads", // Don't mess with this unless you're special..

  // Default module settings
  MODULE_DEFAULTS: {
    calendar: {
      refreshInterval: 5 * 60 * 1000,
      maxItems: 5,
      cutoffDays: 14,
      format: {
        includeTime: true,
        showRelative: true,
        timeStyle: { hour: 'numeric', minute: '2-digit' },
        dateStyle: { month: 'short', day: 'numeric', weekday: 'long' }
      }
    },
    news: {
      refreshInterval: 30 * 60 * 1000, // 30 minutes
      country: "us",
      category: "technology", 
      sources: [],  // placeholder
      maxItems: 25,
      displayTime: 10000, // 10 seconds
      randomize: false,
    },
    weather: {
      refreshInterval: 30 * 60 * 1000, // 30 minutes
      // below are placeholders, not currently used
      units: "imperial",
      showHumidity: true,
      showWind: true,
      iconStyle: "flat",
    },
    photos: {
      pollingInterval: 1 * 60 * 1000, // check for new uploads
      transitionTime: 10000, // display time, 10 seconds
      fadeDuration: 1000,
    }
  },

  //
  // PRIVATE ENTRIES - Set these in the .env
  //
  USER_EMAIL: process.env.USER_EMAIL,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  WEATHER_LAT: process.env.WEATHER_LAT,
  WEATHER_LON: process.env.WEATHER_LON,
  CALENDAR_URLS: process.env.CALENDAR_URLS
  ? process.env.CALENDAR_URLS.split(",")
  : [],

};