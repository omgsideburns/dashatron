// Load core modules
const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
const config = require("./config");

// Initialize the Express app
const app = express();

// Serve static frontend files from the 'Public' directory
app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Dynamically load modular components from ./modules
const modulePath = path.join(__dirname, "modules");
const public = path.join(__dirname, "Public");
const publicJS = path.join(__dirname, "Public/js");
const publicCSS = path.join(__dirname, "Public/css");
const publicTemplates = path.join(__dirname, "Public/templates");
const apiDir = path.join(__dirname, "api");
const indexPath = path.join(__dirname, "src/index.template.html");
const indexOutputPath = path.join(__dirname, "Public/index.html");
const srcDir = path.join(__dirname, "src");
const coreJS = path.join(srcDir, "dashatron.js");
const coreCSS = path.join(srcDir, "dashatron.css");

function injectLinksIntoHTML(html, linksByType) {
  const { cssLinks, jsLinks } = linksByType;

  html = html.replace(
    /<!--\s*MODULE_CSS_HERE\s*-->/,
    cssLinks.join("\n  ")
  );

  html = html.replace(
    /<!--\s*MODULE_JS_HERE\s*-->/,
    jsLinks.join("\n  ")
  );

  return html;
}

// Copy core assets to public directories
fs.copyFileSync(coreJS, path.join(publicJS, "dashatron.js"));
fs.copyFileSync(coreCSS, path.join(publicCSS, "dashatron.css"));
fs.copyFileSync(path.join(srcDir, "upload.html"), path.join(public, "upload.html"));

[public, publicJS, publicCSS, publicTemplates].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function loadModules() {
  let cssLinks = [];
  let jsLinks = [];

  cssLinks.push(`<link rel="stylesheet" href="css/dashatron.css" />`);
  jsLinks.push(`<script src="js/dashatron.js" defer></script>`);

  if (!fs.existsSync(modulePath)) return;
  fs.readdirSync(modulePath, { withFileTypes: true }).forEach(dirent => {
    if (!dirent.isDirectory()) return;
    const mod = dirent.name;
    const modDir = path.join(modulePath, mod);

    fs.readdirSync(modDir).forEach(file => {
      const fullPath = path.join(modDir, file);
      if (file.endsWith("-api.js")) {
        const apiName = file.replace("-api.js", "");
        const routePath = `/api/${apiName}`;

        app.use(routePath, require(fullPath));
      } else if (file.endsWith(".js")) {
        // Read the file content to update import paths
        let content = fs.readFileSync(fullPath, "utf8");
        // Replace import config from "../../config.js" to "../js/client-config.js"
        content = content.replace(
          /import\s+config\s+from\s+["']\.\.\/\.\.\/config\.js["'];?/g,
          'import config from "../js/client-config.js";'
        );
        // Write the updated content to the publicJS directory
        fs.writeFileSync(path.join(publicJS, file), content, "utf8");
        jsLinks.push(`<script type="module" src="js/${file}"></script>`);
      } else if (file.endsWith(".css")) {
        fs.copyFileSync(fullPath, path.join(publicCSS, file));
        cssLinks.push(`<link rel="stylesheet" href="css/${file}" />`);
      } else if (file.endsWith(".html")) {
        fs.copyFileSync(fullPath, path.join(publicTemplates, file));
      }
    });
  });

  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, "utf8");
    html = injectLinksIntoHTML(html, { cssLinks, jsLinks });
    fs.writeFileSync(indexOutputPath, html, "utf8");
  }
}

loadModules();

// Write safe client config
const clientConfig = {
  MODULE_DEFAULTS: config.MODULE_DEFAULTS,
};

fs.writeFileSync(
  path.join(publicJS, "client-config.js"),
  `export default ${JSON.stringify(clientConfig, null, 2)};`
);

// Start the server
app.listen(config.PORT, () => {
  console.log(`Dashboard running at http://localhost:${config.PORT}`);
});