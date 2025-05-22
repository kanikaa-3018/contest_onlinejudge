const express = require("express");
const router = express.Router();
const Submission = require("../models/submissionModel.js");

// Get all submissions for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submission/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId });
    // console.log(submissions)
    const mapped = submissions.map((s) => ({
      questionId: s.questionId,
      status: s.status,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:questionId/user/:userId", async (req, res) => {
  try {
    const submission = await Submission.findOne({
      userId: req.params.userId,
      questionId: req.params.questionId,
    });

    if (!submission) {
      return res.json({ status: "Not Attempted" });
    }

    res.json({ status: submission.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  const { userId, questionId, code, language, status } = req.body;
  // console.log("Received submission:", req.body);

  try {
    const existing = await Submission.findOne({ userId, questionId });

    if (existing) {
      existing.code = code;
      existing.language = language;
      existing.status = status;
      existing.submittedAt = new Date();
      await existing.save();
      return res.json({ message: "Submission updated", submission: existing });
    }

    const newSubmission = new Submission({ userId, questionId, code, language, status });
    await newSubmission.save();
    res.status(201).json({ message: "Submission saved", submission: newSubmission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
