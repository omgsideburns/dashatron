// calendar.js

const CALENDAR_API = "/api/calendar";

async function loadCalendar() {
    const res = await fetch(CALENDAR_API);
    const items = await res.json();
    const generalList = document.getElementById("calendar-list");
    const trashList = document.getElementById("trash-calendar-list");
  
    generalList.innerHTML = "";
    trashList.innerHTML = "";
  
    items.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.date}</strong>: ${item.event}`;
      if (item.type === "trash") {
        trashList.appendChild(li);
      } else {
        generalList.appendChild(li);
      }
    });
  }

loadCalendar();