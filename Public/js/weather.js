// weather.js

const WEATHER_API = "/api/weather";

async function loadWeather() {
  const res = await fetch(WEATHER_API);
  const data = await res.json();

  const el = document.getElementById("weather-info");
  el.innerHTML = `
    <div class="current-weather">
      <img src="${data.current.icon}" alt="${data.current.condition}" />
      <div><strong>${data.current.condition}</strong>, ${data.current.temp}°</div>
      <div>Wind: ${data.current.wind}</div>
    </div>
    <div class="hourly-forecast">
      <h4>Hourly</h4>
      <ul>
        ${data.hourly.map(h => `
          <li>
            ${new Date(h.time).getHours()}:00 - ${h.temp}°${h.unit}, ${h.condition}
            <img src="${h.icon}" alt="${h.condition}" />
          </li>
        `).join("")}
      </ul>
    </div>
    <div class="five-day-forecast">
      <h4>5-Day Forecast</h4>
      <ul>
        ${data.fiveDay.map(d => `
          <li>
            <strong>${d.name}</strong>: ${d.temp}, ${d.condition}
            <img src="${d.icon}" alt="${d.condition}" />
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

loadWeather();