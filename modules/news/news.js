// news.js

const NEWS_API = "/api/news";
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
  if (newsItems.length > 0) {
    showArticle(newsIndex);
    setInterval(showNextArticle, 9000); // Change every 8 seconds
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

  container.innerHTML = template;
}

function showNextArticle() {
  newsIndex = (newsIndex + 1) % newsItems.length;
  showArticle(newsIndex);
}

loadNews();