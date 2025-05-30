const express = require("express");
const router = express.Router();
const ical = require("node-ical");
const config = require("../../config");  // brings in config vars, list below
const CALENDAR_SETTINGS = config.MODULE_DEFAULTS.calendar;
const CALENDAR_URLS = config.CALENDAR_URLS;
const cutoffDays = CALENDAR_SETTINGS.cutoffDays;

let cachedEvents = [];
let lastFetched = 0;
const REFRESH_INTERVAL = CALENDAR_SETTINGS.refreshInterval;

router.get("/", (req, res) => {
  if (cachedEvents.length > 0) {
    res.json(cachedEvents);
  } else {
    res.status(503).json({ error: "Calendar data not yet available." });
  }
});

async function refreshCalendar() {
  try {
    let events = [];
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() + cutoffDays);

    for (const url of CALENDAR_URLS) {
      let type = "main";
      if (url.includes("recollect")) type = "trash";

      try {
        const data = await ical.async.fromURL(url);

        for (const key in data) {
          const ev = data[key];
          if (ev.type === "VEVENT") {
            const evDate = new Date(ev.start);
            if (evDate >= today && evDate <= cutoff) {
              const isAllDay = ev.datetype === 'date' || ev.startParams?.VALUE === 'DATE';
              events.push({
                date: isAllDay
                  ? `${ev.start.getFullYear()}-${String(ev.start.getMonth() + 1).padStart(2, "0")}-${String(ev.start.getDate()).padStart(2, "0")}`
                  : evDate.toISOString(),
                event: typeof ev.summary === "object" && ev.summary?.val ? ev.summary.val : ev.summary,
                allDay: isAllDay,
                type
              });
            }
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to load calendar from ${url}: ${err.message}`);
        continue;
      }
    }

    events.sort((a, b) => a.date.localeCompare(b.date));
    if (CALENDAR_SETTINGS.maxItems) {
      events = events.slice(0, CALENDAR_SETTINGS.maxItems);
    }
    cachedEvents = events;
    lastFetched = Date.now();
  } catch (err) {
    console.error("Failed to refresh calendars", err);
  }
}

refreshCalendar();
setInterval(refreshCalendar, REFRESH_INTERVAL);

// Export the router to be used in server.js
module.exports = router;