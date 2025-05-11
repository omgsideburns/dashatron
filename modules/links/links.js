// links.js

// helper to remove comments
function stripComments(template) {
    return template.replace(/<!--[\s\S]*?-->/g, "");
  }
  
  async function loadLinks() {
    const el = document.getElementById("links-icons");
    if (!el) return;
  
    const tpl = await fetch("/templates/links-icons.html").then(res => res.text());
    el.innerHTML = stripComments(tpl);
  }
  
  document.addEventListener("DOMContentLoaded", loadLinks);

  // input module implementation..
  registerInputHandler("links-icons", e => {
    if (e.key === "Enter") {
      const link = document.activeElement.closest("a");
      if (link) link.click();
    }
  });