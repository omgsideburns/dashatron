# Dashy

This is Dashy — a DIY dashboard for Raspberry Pi (or any browser) that pulls in stuff like weather, calendars, photos, and headlines, and throws it up on a dark-mode screen. Built to run on a TV, fridge screen, or whatever you’ve got laying around.

## What It Does

- 📅 Pulls in multiple calendars (iCloud, Recollect, holidays, etc)
- 🌤️ Current weather + hourly + 5-day via National Weather Service
- 📰 News headlines from NewsAPI.org with thumbnails and summaries
- 🖼️ Auto-rotating photo gallery with upload support from your phone
- 🕹️ CEC + arrow key navigation support (remote or keyboard)
- 🔁 APIs refresh themselves, frontend updates automatically
- 🎨 Fully stylable with your own CSS

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Make a `.env` file** in the root:
   ```env
   WEATHER_LAT=...
   WEATHER_LON=...
   USER_EMAIL=...
   NEWS_API_KEY=...
   CALENDAR_URLS=... # comma-separated
   ```

3. **Start it**:
   ```bash
   npm start
   ```

4. Hit it in your browser at [http://localhost:3000](http://localhost:3000)

## Folder Layout

```
Dashy/
├── api/          # News, weather, calendar, uploader
├── Public/       # HTML, JS, CSS, templates
├── uploads/      # Uploaded images (git-ignored)
├── .env          # Your secrets (don't commit)
├── config.js     # Constants and intervals
├── server.js     # Express app
└── package.json
```

## Versioning

Following [semver](https://semver.org/):
- Major: Breaks stuff
- Minor: Adds stuff
- Patch: Fixes stuff

## License

MIT. Do what you want with it.

## Screenshots

Still need to grab some — will update soon.