const express = require('express');
const router = express.Router();
const axios = require('axios');

// Prefer using the official Google Generative AI SDK when available
let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  GoogleGenerativeAI = null;
}

// Optional personalization
const jwt = require('jsonwebtoken');
const Log = require('../models/Log.model');

// Quick sanity endpoints for debugging
router.get('/', (req, res) => {
  return res.json({ ok: true, msg: 'AI route root — POST /chat to use the AI proxy' });
});

router.get('/ping', (req, res) => {
  return res.json({ ok: true, time: new Date().toISOString() });
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { message, options } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing required "message" string in request body.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI backend is not configured. Set GEMINI_API_KEY in .env' });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    // If token is provided, try to get user's recent logs and include a compact summary in context
    let userLogsSummary = '';
    const token = req.header('x-auth-token');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded?.user?.id;
        if (userId) {
          // Fetch latest logs for the user, limit count and fields
          const logs = await Log.find({ user: userId })
            .sort({ date: -1 })
            .limit(10)
            .select('title type mood date content')
            .lean();

          // Build a concise, safe summary string; truncate large content
          const lines = logs.map((lg, idx) => {
            const parts = [];
            parts.push(`#${idx + 1}`);
            if (lg.title) parts.push(`title: ${String(lg.title).slice(0, 80)}`);
            if (lg.type) parts.push(`type: ${String(lg.type).slice(0, 40)}`);
            if (lg.mood) parts.push(`mood: ${String(lg.mood).slice(0, 40)}`);
            if (lg.date) parts.push(`date: ${new Date(lg.date).toISOString().slice(0, 10)}`);
            // content can be mixed; stringify and clamp
            const contentStr = (() => {
              try { return JSON.stringify(lg.content); } catch (_) { return String(lg.content); }
            })();
            if (contentStr) parts.push(`content: ${contentStr.slice(0, 200)}`);
            return parts.join(', ');
          });
          userLogsSummary = lines.join('\n');
        }
      } catch (_) {
        // Ignore personalization if token invalid
      }
    }

    let d = null;
    let reply = null;

    if (GoogleGenerativeAI) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const sdkModel = genAI.getGenerativeModel({ model });
        const prompt = userLogsSummary
          ? `You are an assistant for a journaling app. The user is chatting about their logs.\n\n` +
            `Recent user logs (most recent first):\n${userLogsSummary}\n\n` +
            `User says: ${message}`
          : message;
        const result = await sdkModel.generateContent(prompt);
        d = await result.response;
        reply = d.text();
      } catch (sdkErr) {
        console.error('GenAI SDK error (falling back to REST):', sdkErr?.response?.data || sdkErr.message || sdkErr);
        d = null;
      }
    }

    if (!reply) {
      const apiUrl =
        process.env.GEMINI_API_URL ||
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const prompt = userLogsSummary
        ? `You are an assistant for a journaling app. The user is chatting about their logs.\n\n` +
          `Recent user logs (most recent first):\n${userLogsSummary}\n\n` +
          `User says: ${message}`
        : message;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(options || {}),
      };

      const resp = await axios.post(apiUrl, payload, { timeout: 20000 });
      d = resp.data || {};
      reply = d.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    if (reply) {
      return res.json({ reply });
    } else {
      console.error('No textual reply from AI (raw:', JSON.stringify(d).slice(0, 500), ')');
      return res.status(500).json({ error: 'No textual reply from AI.' });
    }

  } catch (err) {
    console.error('AI proxy error: status=', err?.response?.status, 'data=', err?.response?.data || err.message || err);
    return res.status(500).json({
      error: 'AI request failed',
      details: err?.response?.data || err.message || String(err),
    });
  }
});

module.exports = router;