const express = require('express');
const axios = require('axios');
const router = express.Router();
require("dotenv").config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
console.log(GEMINI_API_KEY)

router.post('/proficiency', async (req, res) => {
  const { submissions } = req.body;

  const prompt = `
  Analyze the following coding submission data and give a proficiency score out of 100.
  Also provide a short explanation.

  Submissions:
  ${JSON.stringify(submissions)}
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Gemini Suggestion Error:", err.response?.data || err.message);

    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
});

router.post('/suggestion', async (req, res) => {
  const { submissions } = req.body;

  const prompt = `
  Based on the following coding submissions (language, status, difficulty, tags), suggest the next best topic or type of question the user should practice. Keep it under 30 words.

  Submissions:
  ${JSON.stringify(submissions)}
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    console.error("Gemini Suggestion Error:", err.response?.data || err.message);

    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
});

module.exports = router;
