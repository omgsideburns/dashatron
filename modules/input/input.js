/* 
─────────────────────────────────────────────────────────────
  Dashatron Input Module

  This module captures input from keyboard or CEC sources.

  Reserved navigation keys (handled here globally):
    - "ArrowLeft", "ArrowRight"   → Section navigation
    - (Planned: "ArrowUp", "ArrowDown" for sub-selection or vertical dashboards)

  CEC equivalents:
    - "ArrowLeft"       ←  ←
    - "ArrowRight"      →  →
    - "Enter" or "OK"   →  Select
    - "MediaPause"      →  Pause
    - "MediaPlay"       →  Play
    - "MediaStop"       →  Stop
    - "MediaTrackNext"  →  Skip / Next
    - "MediaTrackPrevious" → Previous
    - "Back"            →  Exit / Close
    - "Menu"            →  Module Options
    - "Info"            →  Show Details

  Example usage in module JS:
    registerInputHandler("news-display", e => {
      if (e.key === "Enter") openFullArticle();
      if (e.key === "MediaPause") stopScrolling();
      if (e.key === "MediaTrackNext") showNextArticle();
    });

  To focus an element, include in HTML:
    <div id="news-display" tabindex="0" data-dash-focus></div>
─────────────────────────────────────────────────────────────
*/


const NAV_KEYS = ["ArrowLeft", "ArrowRight"];
let focusables = [];
let currentIndex = 0;
const inputHandlers = {}; // Maps DOM ID → handler function

function refreshFocusables() {
  focusables = Array.from(document.querySelectorAll("[data-dash-focus]"));
  if (focusables.length && !document.activeElement.hasAttribute("data-dash-focus")) {
    focusElement(focusables[0]);
  }
}

function focusElement(el) {
  if (!el) return;
  // Remove .dash-focused from all, add to new
  focusables.forEach(f => f.classList.remove("dash-focused"));
  el.classList.add("dash-focused");
  el.focus();
  currentIndex = focusables.indexOf(el);
}

function focusNext(dir = 1) {
  if (!focusables.length) return;
  currentIndex = (currentIndex + dir + focusables.length) % focusables.length;
  focusElement(focusables[currentIndex]);
}

function registerInputHandler(id, handlerFn) {
  // Best practice: ensure your element has tabindex="0" and data-dash-focus attribute
  // This allows it to receive focus and input events properly.
  inputHandlers[id] = handlerFn;
}

function dispatchToHandler(e) {
  const id = document.activeElement?.id;
  const handler = inputHandlers[id];
  if (handler) handler(e);
}

document.addEventListener("keydown", e => {
  if (NAV_KEYS.includes(e.key)) {
    e.preventDefault();
    focusNext(e.key === "ArrowRight" ? 1 : -1);
  } else {
    dispatchToHandler(e);
  }
});

// Expose registration function
window.registerInputHandler = registerInputHandler;

// ⏩ CEC integration stub — call this from your CEC input bridge
window.receiveCECInput = function (cecKey) {
  const e = new KeyboardEvent("keydown", { key: cecKey });
  document.dispatchEvent(e);
};

// Initialize on page load
window.addEventListener("DOMContentLoaded", refreshFocusables);

// Auto-hide cursor after inactivity
let cursorTimeout;

function resetCursorTimer() {
  document.body.style.cursor = "default";
  clearTimeout(cursorTimeout);
  cursorTimeout = setTimeout(() => {
    document.body.style.cursor = "none";
  }, 3000);
}

["mousemove", "keydown", "click"].forEach(evt =>
  document.addEventListener(evt, resetCursorTimer)
);

resetCursorTimer(); // initialize