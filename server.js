const express = "express";
const cors = "cors";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load hymns data
const hymns = require("./lyrics.json");

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
  res.send("Welcome to the Ilocano Hymns API!");
});

app.listen(PORT, () =>
  console.log(`Ilocano Hymns API running on http://localhost:${PORT}`)
);
