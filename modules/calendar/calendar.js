// calendar.js

import config from "../../config.js";
const CAL_FORMAT = config.MODULE_DEFAULTS.calendar.format;

const CALENDAR_API = "/api/calendar";

function formatEventDate(isoString, allDay = false) {
  const eventDate = new Date(isoString);
  if (isNaN(eventDate)) return "Invalid Date";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  const isToday = eventDay.getTime() === today.getTime();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = eventDay.getTime() === tomorrow.getTime();

  const weekday = eventDate.toLocaleDateString(undefined, { weekday: CAL_FORMAT.dateStyle?.weekday });
  const dateStr = eventDate.toLocaleDateString(undefined, CAL_FORMAT.dateStyle);
  const timeStr = CAL_FORMAT.includeTime
    ? eventDate.toLocaleTimeString(undefined, CAL_FORMAT.timeStyle)
    : "";

  if (CAL_FORMAT.showRelative) {
    if (isToday && !allDay && CAL_FORMAT.includeTime) return `Today at ${timeStr}`;
    if (isToday) return `Today`;
    if (isTomorrow && !allDay && CAL_FORMAT.includeTime) return `Tomorrow at ${timeStr}`;
    if (isTomorrow) return `Tomorrow`;
  }

  return allDay || !CAL_FORMAT.includeTime
    ? `${weekday}, ${dateStr}`
    : `${weekday}, ${dateStr} at ${timeStr}`;
}

async function loadCalendar() {
    const res = await fetch(CALENDAR_API);
    const items = await res.json();
    const generalList = document.getElementById("calendar-list");
    // const trashList = document.getElementById("trash-calendar-list");
  
    generalList.innerHTML = "";
    // commenting out all trash cal separation
    // trashList.innerHTML = "";
  
    items.forEach(item => {
      const daysOut = Math.floor((new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24));
      const fadeLevel = Math.min(Math.max(daysOut, 0), 4); // cap at 4 groups
      const li = document.createElement("li");
      const friendlyDate = formatEventDate(item.date, item.allDay);
      li.classList.add(`fade-${fadeLevel}`);
      li.innerHTML = `<span class="calendar-date">${friendlyDate}</span><span class="calendar-event">${item.event}</span>`;
      // uncomment to separate trash from general calendar
      // if (item.type === "trash") {
      //  trashList.appendChild(li);
      //} else {
        generalList.appendChild(li);
      //}
      console.log("Calendar item:", item);
    });
  }

loadCalendar();