const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel.js");
const axios = require("axios");
const dotenv = require("dotenv");
const fetch=require("node-fetch")
dotenv.config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// GET all questions
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// POST new question
router.post("/", isAdmin, async (req, res) => {
  const question = new Question(req.body);
  await question.save();
  res.status(201).json(question);
});

// PUT update question
router.put("/:id", isAdmin, async (req, res) => {
  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE a question
router.delete("/:id", isAdmin, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    console.log(question);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching question" });
  }
});

router.post("/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { language, code } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const testCases = question.testCases;

    for (let i = 0; i < testCases.length; i++) {
      const { input, output: expectedOutput } = testCases[i];

      const response = await axios.post("http://localhost:8080/execute", {
        language,
        code,
        input,
      });

      const resultOutput = response.data.output?.trim();
      const expected = expectedOutput?.trim();

      if (resultOutput !== expected) {
        return res.json({
          success: false,
          failedCaseIndex: i,
          expected,
          actual: resultOutput,
        });
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/generate-hints/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Call n8n webhook
    const response = await fetch('https://imtkanika.app.n8n.cloud/webhook-test/webhook/hint-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: questionId,
        title: question.title,
        description: question.description
      })
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'n8n failed to generate hints' });
    }

    const result = await response.json();
    // console.log('Raw n8n result:', result);

    // Extract and split the output string
    const rawOutput = result[0]?.output;
    if (!rawOutput) {
      return res.status(500).json({ error: 'Invalid format received from n8n' });
    }

    // Split output string into lines and clean each one
    const hintsArray = rawOutput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '')); 

    if (hintsArray.length === 0) {
      return res.status(500).json({ error: 'No hints extracted from n8n output' });
    }

    question.hints = hintsArray;
    await question.save();

    res.json({
      message: 'Hints generated successfully',
      questionId,
      hints: hintsArray
    });

  } catch (error) {
    console.error('Error generating hints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// router.get('/hint/:id', async (req, res) => {
//   try {
//     const question = await Question.findById(req.params.id);
//     if (!question) return res.status(404).json({ error: 'Question not found' });

//     const prompt = `
//       You are a helpful coding assistant. Provide a single useful hint to solve the following coding problem without giving the full answer.

//       Problem Title: ${question.title}
//       Problem Description: ${question.description}

//       Hint:
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.5,
//       max_tokens: 100,
//     });

//     const hint = response.choices[0].message.content.trim();
//     res.json({ hint });
//   } catch (err) {
//     console.error("Error generating hint:", err.message);
//     res.status(500).json({ error: 'Failed to generate hint' });
//   }
// });

module.exports = router;
