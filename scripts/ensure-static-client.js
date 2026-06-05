import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, "..", "dist", "client");
const assetsDir = path.join(clientDir, "assets");
const rootIndex = path.join(__dirname, "..", "dist", "index.html");

if (fs.existsSync(clientDir)) {
  // Normal case: dist/client exists (multi-output build)
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
} else if (fs.existsSync(rootIndex)) {
  // Single-output build: copy dist/index.html into dist/client/index.html
  fs.mkdirSync(clientDir, { recursive: true });
  fs.copyFileSync(rootIndex, path.join(clientDir, "index.html"));
  // If assets exist at dist/assets, copy them into dist/client/assets
  const rootAssets = path.join(__dirname, "..", "dist", "assets");
  if (fs.existsSync(rootAssets)) {
    const targetAssets = path.join(clientDir, "assets");
    fs.mkdirSync(targetAssets, { recursive: true });
    for (const f of fs.readdirSync(rootAssets)) {
      fs.copyFileSync(path.join(rootAssets, f), path.join(targetAssets, f));
    }
  }
  console.log("Copied dist/index.html -> dist/client/index.html");
} else {
  // Fallback: create minimal index.html so postbuild never fails
  fs.mkdirSync(clientDir, { recursive: true });
  const fallback = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WeatherAI</title>
  </head>
<body>
  <div id="root"></div>
  </body>
</html>`;
  fs.writeFileSync(path.join(clientDir, "index.html"), fallback);
  console.log("Created fallback dist/client/index.html");
}
