import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side AI Item Writer Route
app.post('/api/generate-exam', async (req, res) => {
  try {
    const { theme, audience = 'Erwachsene', city = 'München', institution = 'Goethe-Institut', examNumber = 11 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallback: true,
      });
    }

    const systemPrompt = `You are an expert item writer for the Goethe-Institut / ÖSD Zertifikat B1 examination (Modul LESEN).
Your task is to generate a COMPLETE, authentic 30-item mock exam for the Zertifikat B1 (${audience} variant) on the theme: "${theme}".
Language: GERMAN at CEFR Level B1. No C1/B2 academic jargon. Sentence length 8-18 words. Standard Goethe rubrics.
Structure must be exactly:
- TEIL 1 (Items 1-6): Personal email/blog post (200-260 words) + 6 True/False items + Beispiel 0.
- TEIL 2 (Items 7-12): TWO short press texts (130-180 words each). Text A has items 7-9 (a/b/c) + Beispiel 0. Text B has items 10-12 (a/b/c).
- TEIL 3 (Items 13-19): 7 situations + 10 advertisements (labeled 'a' through 'j') + Beispiel 0.
  CRUCIAL GOETHE RULE: Exactly ONE situation has NO matching ad (answer must be "0"). Exactly ONE ad is unused.
- TEIL 4 (Items 20-26): 7 reader comments (40-70 words) on a controversial debate about "${theme}" + Beispiel 0. Each person marked Ja or Nein.
- TEIL 5 (Items 27-30): 1 formal instructional/regulatory text (Hausordnung, Benutzungsordnung, 250-320 words) with 4 sections + 4 three-option items (27-30, a/b/c).
All 30 items must be strictly sequential (1 to 30) with unambiguous correct answers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a complete Goethe/ÖSD B1 Modul Lesen exam on the theme "${theme}" for ${institution} in ${city}. Return JSON matching the official structure.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedExam = JSON.parse(jsonText);

    return res.json({
      success: true,
      exam: parsedExam,
    });
  } catch (error: any) {
    console.error('Error generating exam via Gemini API:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate exam',
      fallback: true,
    });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`B1 Exam Studio server running on http://0.0.0.0:${port}`);
  });
}

startServer();
