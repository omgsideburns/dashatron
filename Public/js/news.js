// new.js

const NEWS_API = "/api/news";

async function loadNews() {
    const res = await fetch(NEWS_API);
    const items = await res.json();
    const list = document.getElementById("news-list");
    list.innerHTML = items
      .map(item => `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`)
      .join("");
  }

loadNews();