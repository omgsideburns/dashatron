// news.js

import config from "../../config.js";

const NEWS_API = "/api/news";
const NEWS_SETTINGS = config.MODULE_DEFAULTS.news;
let newsItems = [];
let newsIndex = 0;

//  function to strip comments from templates
function stripComments(template) {
  return template.replace(/<!--[\s\S]*?-->/g, "");
}

// render template vars
function renderTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || "");
}

async function loadNews() {
  const res = await fetch(NEWS_API);
  newsItems = await res.json();
  if (NEWS_SETTINGS.randomize) {
    newsItems.sort(() => Math.random() - 0.5);
  }
  if (newsItems.length > 0) {
    showArticle(newsIndex);
    setInterval(showNextArticle, NEWS_SETTINGS.displayTime || 9000); // Change every 8 seconds
  }
}

async function showArticle(index) {
  const item = newsItems[index];
  const container = document.getElementById("news-display");
  if (!container) return;

  const templateRes = await fetch("/templates/news-item.html");
  let template = await templateRes.text();

  template = stripComments(template);
  template = renderTemplate(template, item);

  container.classList.remove("show");
  setTimeout(() => {
    container.innerHTML = template;
    container.classList.add("show");
  }, NEWS_SETTINGS.fadeDuration || 1000);
}

function showNextArticle() {
  if (newsItems.length === 0) return;
  newsIndex = (newsIndex + 1) % newsItems.length;
  showArticle(newsIndex);
}

// pop up code - need to move layout to an html template in the future..
async function showFullArticle(article) {
  const templateRes = await fetch("/templates/news-modal.html");
  let template = await templateRes.text();
  template = stripComments(template);
  template = renderTemplate(template, article);

  openModal(template);  // 
}

function hideFullArticle() {
  const overlay = document.getElementById("news-overlay");
  if (overlay) overlay.classList.remove("show");
}

registerInputHandler("news-display", e => {
  // Open the full article
  if (e.key === "Enter") {
    showFullArticle(newsItems[newsIndex]);
  }

  // Close the article overlay
  if (e.key === "Backspace" || e.key === "Back") {
    closeModal()
  }
});

loadNews();