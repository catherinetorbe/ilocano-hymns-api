import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  try {
    const hymnsPath = path.join(__dirname, "..", "lyrics.json");
    const hymns = JSON.parse(fs.readFileSync(hymnsPath, "utf8"));

    // Handle route: /api/hymns
    if (!req.query.title) {
      return res.status(200).json(hymns);
    }

    // Handle route: /api/hymns?title=Daytoy%20Ti%20Biag%20Ko
    const title = decodeURIComponent(req.query.title).toLowerCase();
    const hymn = hymns.find(h => h.title.toLowerCase() === title);

    if (!hymn) {
      return res.status(404).json({ message: "Hymn not found" });
    }

    res.status(200).json(hymn);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
