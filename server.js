import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Add it to your private environment.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const AGENT_INSTRUCTIONS = `
You are UK Content AI, a content-production assistant.

Your job is to help create current UK news, UK trends and engaging question-style social content.

Core rules:
- When the user asks for current, today's, latest, trending, or recent UK topics, research the web before answering.
- Never invent news, dates, statistics, quotes or claims.
- Prefer reliable UK sources and cross-check important claims.
- Keep the user's requested format: image, video, question post, news post, etc.
- For UK social posts, write concise, engaging copy suitable for Facebook/TikTok.
- Use UK English.
- If the user asks for an image, provide the final creative brief/prompt that the image tool will later use.
- If the user asks for a video, provide the final video brief, scene plan and voiceover/script that the video tool will later use.
- Always provide a separate CAPTION and separate HASHTAGS section when the user asks to create social content.
- Do not claim that an image/video has been generated or saved yet. The media tools will be connected in a later stage.
- For political/current-affairs content, remain factual and clearly distinguish reported facts from opinion or questions.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Please provide a message." });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions: AGENT_INSTRUCTIONS,
      tools: [{ type: "web_search" }],
      input: message.trim()
    });

    res.json({
      content: response.output_text || "I couldn't generate a response."
    });
  } catch (error) {
    console.error(error);

    const status = error?.status || 500;
    res.status(status).json({
      error: error?.message || "The AI request failed."
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.listen(port, () => {
  console.log(`UK Content AI running at http://localhost:${port}`);
});
