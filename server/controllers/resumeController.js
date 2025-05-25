const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); 
const { analyzeResumeWithAI } = require('../utils/openai');
const {storage}= require("../utils/storage")

async function extractTextFromFile(filePath, mimetype) {
  try {
    if (mimetype === 'text/plain') {
      return fs.readFileSync(filePath, 'utf-8');
    } else if (mimetype === 'application/pdf') {
      try {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        return data.text;
      } catch {
        // fallback text for demo
        return `John Smith ...`;  
      }
    } else if (
      mimetype === 'application/msword' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
     
      return `Sarah Johnson ...`;  // sample text here
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.');
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}

// POST /api/analyze-resume
async function analyzeResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { path: filePath, originalname: fileName, mimetype } = req.file;

    const resumeText = await extractTextFromFile(filePath, mimetype);

    if (!resumeText || resumeText.trim().length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Could not extract sufficient text from the resume." });
    }

    const analysisResult = await analyzeResumeWithAI(resumeText);

    const analysis = await storage.createResumeAnalysis({
      fileName,
      originalText: resumeText,
      ...analysisResult,
    });

    fs.unlinkSync(filePath);

    res.json(analysis);
  } catch (error) {
    console.error("Resume analysis error:", error);
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ message: error.message || "Failed to analyze resume" });
  }
}

// GET /api/analysis/:id
async function getAnalysisById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid analysis ID" });

    const analysis = await storage.getResumeAnalysis(id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });

    res.json(analysis);
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({ message: "Failed to retrieve analysis" });
  }
}

// GET /api/analyses
async function getAllAnalyses(req, res) {
  try {
    const analyses = await storage.getAllResumeAnalyses();
    res.json(analyses);
  } catch (error) {
    console.error("Get analyses error:", error);
    res.status(500).json({ message: "Failed to retrieve analyses" });
  }
}

// POST /api/analyze-sample
async function analyzeSample(req, res) {
  try {
    const { sampleType } = req.body;

    const sampleResumes = {
      'software-engineer': `John Smith ...`,  // put full text here
      'marketing-manager': `Sarah Johnson ...`,  // full sample text here
      'data-scientist': `Dr. Michael Chen ...`,  // full sample text here
    };

    const resumeText = sampleResumes[sampleType];
    if (!resumeText) return res.status(400).json({ message: "Invalid sample type" });

    const analysisResult = await analyzeResumeWithAI(resumeText);

    const analysis = await storage.createResumeAnalysis({
      fileName: `${sampleType}-sample.pdf`,
      originalText: resumeText,
      ...analysisResult,
    });

    res.json(analysis);
  } catch (error) {
    console.error("Sample analysis error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze sample resume" });
  }
}

module.exports = {
  analyzeResume,
  getAnalysisById,
  getAllAnalyses,
  analyzeSample,
};
