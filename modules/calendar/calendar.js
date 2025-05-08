// calendar.js

const CALENDAR_API = "/api/calendar";

function formatEventDate(isoString, allDay = false) {
  const eventDate = new Date(isoString);
  const now = new Date();

  const isToday = eventDate.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();

  const weekday = eventDate.toLocaleDateString(undefined, { weekday: 'long' });
  const dateStr = eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  if (isToday && !allDay) return `Today at ${timeStr}`;
  if (isToday) return `Today`;

  if (isTomorrow && !allDay) return `Tomorrow at ${timeStr}`;
  if (isTomorrow) return `Tomorrow`;

  return allDay
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
      const li = document.createElement("li");
      const friendlyDate = formatEventDate(item.date, item.allDay);
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