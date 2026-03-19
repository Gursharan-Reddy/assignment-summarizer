import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post('/api/summarize', async (req, res) => {
  const text = req.body?.text?.trim();

  if (!text) {
    return res.status(400).json({ error: 'Input text is required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Missing Groq API Key");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an assistant that converts unstructured text into a strict JSON summary. Return only valid JSON with this shape:
          {
            "summary": "one sentence",
            "keyPoints": ["point 1", "point 2", "point 3"],
            "sentiment": "positive | neutral | negative"
          }
          Rules:
          - summary must be exactly one sentence
          - keyPoints must contain exactly 3 short bullet-style strings
          - sentiment must be one of the allowed labels only
          - do not include markdown
          - do not include extra keys`
        },
        {
          role: "user",
          content: `Text to analyze:\n\n${text}`
        }
      ]
    });

    const llmOutput = JSON.parse(response.choices[0].message.content);
    return res.json(llmOutput);

  } catch (error) {
    console.error("LLM API Error:", error);
    return res.status(500).json({ error: 'Failed to summarize text.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));