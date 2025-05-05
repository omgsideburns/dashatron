const express = require("express");
const router = express.Router();
const ical = require("node-ical");
const config = require("../config");  // brings in config vars, list below
const CALENDAR_URLS = config.CALENDAR_URLS;
const cutoffDays = config.CUTOFF_DAYS;

// Define the route handler for GET /api/calendar
router.get("/", async (req, res) => {
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
              events.push({
                date: evDate.toISOString().slice(0, 10),
                event: ev.summary,
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

    // Sort events by date before responding
    events.sort((a, b) => a.date.localeCompare(b.date));
    res.json(events);
  } catch (err) {
    console.error("Failed to load calendars", err);
    res.status(500).json({ error: "Failed to load calendars" });
  }
});

// Export the router to be used in server.js
module.exports = router;