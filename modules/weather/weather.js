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
  const elForecast = document.getElementById("weather-forecast");

  const [
    currentTpl,
    hourlyTpl,
    fiveDayTpl,
    hourlyItemTpl,
    fiveDayItemTpl,
    forecastTpl
  ] = await Promise.all([
    fetch("/templates/weather-current.html").then(res => res.text()),
    fetch("/templates/weather-hourly.html").then(res => res.text()),
    fetch("/templates/weather-five-day.html").then(res => res.text()),
    fetch("/templates/weather-hourly-item.html").then(res => res.text()),
    fetch("/templates/weather-five-day-item.html").then(res => res.text()),
    fetch("/templates/weather-forecast.html").then(res => res.text()),
  ]);
  
  const currentTemplate = stripComments(currentTpl);
  const currentHTML = renderTemplate(currentTemplate, data.current);
    
  const hourlyItemTemplate = stripComments(hourlyItemTpl);
  const hourlyItems = data.hourly.map(h => renderTemplate(hourlyItemTemplate, h)).join("");
  const hourlyHTML = renderTemplate(stripComments(hourlyTpl), { items: hourlyItems });

  const fiveDayItemTemplate = stripComments(fiveDayItemTpl);
  const fiveDayItems = data.fiveDay.map(d => renderTemplate(fiveDayItemTemplate, d)).join("");
  const fiveDayHTML = renderTemplate(stripComments(fiveDayTpl), { items: fiveDayItems });

  const forecastTemplate = stripComments(forecastTpl);
  const forecastItems = data.raw.forecast.slice(0, 4).map(p => {
    return renderTemplate(forecastTemplate, {
      name: p.name,
      label: p.isDaytime ? "High" : "Low",
      temp: `${p.temperature}°`,
      icon: p.icon,
      condition: p.shortForecast
    });
  }).join("");

  if (elCurrent) elCurrent.innerHTML = currentHTML;
  if (elHourly) elHourly.innerHTML = hourlyHTML;
  if (elFiveDay) elFiveDay.innerHTML = fiveDayHTML;
  if (elForecast) elForecast.innerHTML = forecastItems;

  // dynamic background color changing
  const weatherContainer = document.getElementById("weather-current");
  if (weatherContainer) {
    const conditionText = data.current.condition.toLowerCase();
    let bgClass = "default-bg";

    if (conditionText.includes("clear") || conditionText.includes("sunny")) {
      bgClass = "clear-bg";
    } else if (conditionText.includes("cloud")) {
      bgClass = "cloudy-bg";
    } else if (conditionText.includes("rain") || conditionText.includes("shower")) {
      bgClass = "rain-bg";
    } else if (conditionText.includes("snow")) {
      bgClass = "snow-bg";
    } else if (conditionText.includes("fog") || conditionText.includes("haze")) {
      bgClass = "fog-bg";
    } else if (conditionText.includes("storm") || conditionText.includes("thunder")) {
      bgClass = "storm-bg";
    } 

    weatherContainer.classList.remove(
      "clear-bg", "cloudy-bg", "rain-bg", "snow-bg", "storm-bg", "fog-bg", "default-bg"
    );
    weatherContainer.classList.add(bgClass);
  }
}



loadWeather();