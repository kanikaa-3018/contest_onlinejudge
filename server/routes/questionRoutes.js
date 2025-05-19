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

// POST hints for a question
router.post("/:id/hints", isAdmin, async (req, res) => {
  const { hints } = req.body;  // expects an array of strings

  if (!Array.isArray(hints)) {
    return res.status(400).json({ message: "Hints should be an array" });
  }

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.hints = hints;
    await question.save();

    res.json({ message: "Hints saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST test cases for a question
router.post("/:id/testcases", isAdmin, async (req, res) => {
  const { testCases } = req.body;  // expects array of {input, output}

  if (!Array.isArray(testCases)) {
    return res.status(400).json({ message: "Test cases should be an array" });
  }

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.testCases = testCases;
    await question.save();

    res.json({ message: "Test cases saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
