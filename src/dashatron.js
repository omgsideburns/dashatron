// dashatron.js
// code specific for a modules should be in own file
//

//
//  NAV - Navigating the gui using arrows, cec, etc..  
//  

const items = Array.from(document.querySelectorAll(".nav-item"));
let currentIndex = 0;

// NAV - Fade selection
function focusItem(index) {
    items.forEach(el => {
      el.classList.remove("fading");
      el.blur();
    });
  
    const el = items[index];
    el?.focus();
  
    // Add fading class after delay
    setTimeout(() => {
      el?.classList.add("fading");
      el?.blur(); // optional
    }, 3000);
  }

// NAV - Listen for input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % items.length;
    focusItem(currentIndex);
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    focusItem(currentIndex);
  } else if (e.key === "Enter") {
    items[currentIndex]?.click(); // Trigger action
  }
});

// NAV - Initial focus
focusItem(0);

//
// DATE & TIME - Display in iPhone lock screen style
//

function updateDateTime() {
  const el = document.getElementById("datetime");
  if (!el) return;

  const now = new Date();

  // Format: e.g., Monday, May 6
  const dateString = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Format: e.g., 11:42 PM
  const timeString = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  el.innerHTML = `
    <div class="date-string">${dateString}</div>
    <div class="time-string">${timeString}</div>
  `;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// To display the date/time, add this to your HTML:
//
// <!-- Example in index.html -->
// 

