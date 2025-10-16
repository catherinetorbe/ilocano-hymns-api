import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

// Utility function to log errors
function logError(error) {
  // You can enhance this to write to a file or external logging service
  console.error(`[${new Date().toISOString()}] ERROR:`, error);
}

// Load hymns data with error handling
let hymns = [];
try {
  hymns = JSON.parse(fs.readFileSync("./lyrics.json", "utf-8"));
} catch (error) {
  logError(error);
  // Optionally, exit if data is critical
  // process.exit(1);
}

app.use(cors());
app.use(express.json());

// Get all hymns
app.get("/api/hymns", (req, res) => {
  try {
    res.json(hymns);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Failed to retrieve hymns." });
  }
});

// Get specific hymn by title
app.get("/api/hymns/:title", (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const hymn = hymns.find((h) => h.title.toLowerCase() === title);
    if (!hymn) return res.status(404).json({ message: "Hymn not found" });
    res.json(hymn);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Failed to retrieve hymn." });
  }
});

// Homepage
app.get("/", (req, res) => {
  try {
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
  } catch (error) {
    logError(error);
    res.status(500).send("An error occurred while loading the homepage.");
  }
});

// Global error handler (for unhandled exceptions in routes)
app.use((err, req, res, next) => {
  logError(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () =>
  console.log(`Ilocano Hymns API running on http://localhost:${PORT}`)
);
