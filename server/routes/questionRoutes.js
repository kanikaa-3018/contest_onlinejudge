const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel.js")
const axios=require("axios")

// GET all questions
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// POST new question
router.post("/",isAdmin, async (req, res) => {
  const question = new Question(req.body);
  await question.save();
  res.status(201).json(question);
});

// PUT update question
router.put("/:id",isAdmin, async (req, res) => {
  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE a question
router.delete("/:id",isAdmin, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    console.log(question)
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

module.exports = router;
