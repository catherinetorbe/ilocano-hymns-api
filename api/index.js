import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Load hymns data
const hymns = JSON.parse(fs.readFileSync("./lyrics.json", "utf8"));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Ilocano Hymns API 🎶",
    routes: ["/api/hymns", "/api/hymns/:title"]
  });
});

// Get all hymns
app.get("/api/hymns", (req, res) => {
  res.json(hymns);
});

// Get hymn by title
app.get("/api/hymns/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const hymn = hymns.find(h => h.title.toLowerCase() === title);
  if (!hymn) return res.status(404).json({ message: "Hymn not found" });
  res.json(hymn);
});

// Export as Vercel serverless handler
export default app;
