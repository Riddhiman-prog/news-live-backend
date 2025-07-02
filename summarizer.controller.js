module.exports = async (req, res) => {
  const { content } = req.body;

  // 🚫 If no content is sent from frontend
  if (!content) {
    return res.status(400).json({ error: "No content provided" });
  }

  try {
    // 🧠 Gemini API call using built-in fetch (Node 18+)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following article in 3 bullet points:\n\n${content}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (summary && summary.trim() !== "") {
      console.log("🧠 Summary generated:", summary);
      res.json({ summary });
    } else {
      res.status(500).json({ error: "Gemini didn't return a valid summary." });
    }
  } catch (err) {
    console.error("❌ Error from Gemini API:", err);
    res.status(500).json({ error: "Something went wrong while summarizing." });
  }
};
