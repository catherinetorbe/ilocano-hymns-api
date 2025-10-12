import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  let apiStatus = "✅ API is working!";
  let hymnCount = null;
  let errorMsg = null;

  try {
    const hymnsPath = path.join(__dirname, "..", "lyrics.json");
    const hymns = JSON.parse(fs.readFileSync(hymnsPath, "utf8"));
    hymnCount = hymns.length;
  } catch (err) {
    apiStatus = "⚠️ API is working, but there is an error loading hymns data.";
    errorMsg = err.message;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Ilocano Hymns API</title>
      <style>
        body { font-family: sans-serif; margin: 2rem; background: #f9f9f9; }
        h1 { color: #2d3a4b; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; }
        .routes { margin-top: 1.5rem; }
        .status { margin: 1rem 0; font-weight: bold; }
        .error { color: #b00; }
      </style>
    </head>
    <body>
      <h1>🎶 Ilocano Hymns API</h1>
      <div class="status">${apiStatus}</div>
      ${
        hymnCount !== null
          ? `<div>Number of hymns available: <b>${hymnCount}</b></div>`
          : ""
      }
      ${errorMsg ? `<div class="error">Error: ${errorMsg}</div>` : ""}
      <div class="routes">
        <h2>Available Endpoints</h2>
        <ul>
          <li>
            <code>GET /api/hymns</code><br/>
            <small>List all hymns</small>
          </li>
          <li>
            <code>GET /api/hymns?title=Daytoy%20Ti%20Biag%20Ko</code><br/>
            <small>Get a hymn by its title</small>
          </li>
        </ul>
      </div>
      <footer style="margin-top:2rem;color:#888;">
        &copy; ${new Date().getFullYear()} Ilocano Hymns API
      </footer>
    </body>
    </html>
  `);
}
