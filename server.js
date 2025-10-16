import express from "express";
import cors from "cors";
import fs from "fs";

const hymns = JSON.parse(fs.readFileSync("./lyrics.json", "utf-8"));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Get all hymns
app.get("/api/hymns", (req, res) => {
  res.json(hymns);
});

// Get specific hymn by title
app.get("/api/hymns/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const hymn = hymns.find((h) => h.title.toLowerCase() === title);
  if (!hymn) return res.status(404).json({ message: "Hymn not found" });
  res.json(hymn);
});

app.get("/", (req, res) => {
  res.send(`
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
      </style>
    </head>
    <body>
      <h1>🎶 Ilocano Hymns API</h1>
      <p>Welcome! This API provides access to a collection of Ilocano hymns.</p>
      <div class="routes">
        <h2>Available Endpoints</h2>
        <ul>
          <li>
            <code>GET /api/hymns</code><br/>
            <small>List all hymns</small>
          </li>
          <li>
            <code>GET /api/hymns/:title</code><br/>
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
});

app.listen(PORT, () =>
  console.log(`Ilocano Hymns API running on http://localhost:${PORT}`)
);
