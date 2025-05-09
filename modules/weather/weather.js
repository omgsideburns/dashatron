// weather.js

const WEATHER_API = "/api/weather";

import config from "../../config.js";
const WEATHER_SETTINGS = config.MODULE_DEFAULTS.weather;

//  function to strip comments from templates
function stripComments(template) {
  return template.replace(/<!--[\s\S]*?-->/g, "");
}

// render template vars
function renderTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || "");
}

// load and build templates
async function loadWeather() {
  const res = await fetch(WEATHER_API);
  const data = await res.json();

  const elCurrent = document.getElementById("weather-current");
  const elHourly = document.getElementById("weather-hourly");
  const elFiveDay = document.getElementById("weather-five-day");

  const [
    currentTpl,
    hourlyTpl,
    fiveDayTpl,
    hourlyItemTpl,
    fiveDayItemTpl
  ] = await Promise.all([
    fetch("/templates/weather-current.html").then(res => res.text()),
    fetch("/templates/weather-hourly.html").then(res => res.text()),
    fetch("/templates/weather-five-day.html").then(res => res.text()),
    fetch("/templates/weather-hourly-item.html").then(res => res.text()),
    fetch("/templates/weather-five-day-item.html").then(res => res.text()),
  ]);
  
  const currentTemplate = stripComments(currentTpl);
  const currentHTML = renderTemplate(currentTemplate, data.current);
    
  const hourlyItemTemplate = stripComments(hourlyItemTpl);
  const hourlyItems = data.hourly.map(h => renderTemplate(hourlyItemTemplate, h)).join("");
  const hourlyHTML = renderTemplate(stripComments(hourlyTpl), { items: hourlyItems });

  const fiveDayItemTemplate = stripComments(fiveDayItemTpl);
  const fiveDayItems = data.fiveDay.map(d => renderTemplate(fiveDayItemTemplate, d)).join("");
  const fiveDayHTML = renderTemplate(stripComments(fiveDayTpl), { items: fiveDayItems });

  if (elCurrent) elCurrent.innerHTML = currentHTML;
  if (elHourly) elHourly.innerHTML = hourlyHTML;
  if (elFiveDay) elFiveDay.innerHTML = fiveDayHTML;
}

loadWeather();