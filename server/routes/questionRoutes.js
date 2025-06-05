const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel.js");
const axios = require("axios");
const dotenv = require("dotenv");
const fetch=require("node-fetch")
dotenv.config();

const backendurl= process.env.BACKEND_URL;


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

//GET question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question,);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching question" });
  }
});

//GENERATE AI hints
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
    const rawOutput = result[0]?.output;
    if (!rawOutput) {
      return res.status(500).json({ error: 'Invalid format received from n8n' });
    }

    
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

router.put("/:id/reference-code", async (req, res) => {
  const { id } = req.params
  console.log(id);
  const { cpp, python, java, javascript } = req.body

  try {
    const question = await Question.findById(id)
    if (!question) {
      return res.status(404).json({ error: "Question not found" })
    }

    
    let updatedSolutions = question.referenceCode.filter(
      (sol) => !["cpp", "python", "java", "javascript"].includes(sol.language)
    )

    const newSolutions = []

    if (cpp) newSolutions.push({ language: "cpp", code: cpp })
    if (python) newSolutions.push({ language: "python", code: python })
    if (java) newSolutions.push({ language: "java", code: java })
    if (javascript) newSolutions.push({ language: "javascript", code: javascript })

    // Replace existing languages with new values
    newSolutions.forEach((newSol) => {
      const existingIndex = question.referenceCode.findIndex(
        (sol) => sol.language === newSol.language
      )
      if (existingIndex !== -1) {
        question.referenceCode[existingIndex].code = newSol.code
      } else {
        question.referenceCode.push(newSol)
      }
    })

    await question.save()

    res.status(200).json({
      message: "Reference solutions updated successfully",
      referenceCode: question.referenceCode,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.get("/:id/reference-code", async (req, res) => {
  const questionId = req.params.id;
  try {
    const question = await Question.findById(questionId); 
    if (!question || !question.referenceCode) {
      return res.status(404).json({ error: "Reference code not found." });
    }
    res.json({ referenceCode: question.referenceCode });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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

      const response = await axios.post(`${backendurl}/execute`, {
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
