import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Load hymns data (use absolute path for Vercel)
const hymnsPath = path.join(__dirname, "..", "lyrics.json");
const hymns = JSON.parse(fs.readFileSync(hymnsPath, "utf8"));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🎵 Welcome to the Ilocano Hymns API!",
    availableRoutes: ["/api/hymns", "/api/hymns/:title"],
  });
});

app.get("/api/hymns", (req, res) => {
  res.json(hymns);
});

app.get("/api/hymns/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const hymn = hymns.find(h => h.title.toLowerCase() === title);
  if (!hymn) return res.status(404).json({ message: "Hymn not found" });
  res.json(hymn);
});

// Export for Vercel (serverless)
export const handler = serverless(app);
export default app;
