import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, "..", "dist", "client");
const assetsDir = path.join(clientDir, "assets");

if (!fs.existsSync(clientDir)) {
  console.error("dist/client not found — make sure `vite build` created it");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const js = files.find((f) => f.endsWith(".js"));
const css = files.find((f) => f.endsWith(".css"));

const index = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WeatherAI</title>
  ${css ? `<link rel="stylesheet" href="/assets/${css}">` : ""}
</head>
<body>
  <div id="root"></div>
  ${js ? `<script type="module" src="/assets/${js}"></script>` : ""}
</body>
</html>`;

fs.writeFileSync(path.join(clientDir, "index.html"), index);
console.log("Created dist/client/index.html");
