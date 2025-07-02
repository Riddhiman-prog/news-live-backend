const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ For Node.js v18+, fetch is built-in — no need to import anything

// ✅ WORKING ROUTE to fetch news from NewsAPI
app.get("/api/news", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ NewsAPI fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// 🧠 Route for Gemini summarization
const summarizer = require("./summarizer.controller");
app.post("/api/summarize", summarizer);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
