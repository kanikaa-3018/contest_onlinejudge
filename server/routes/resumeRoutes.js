const express = require('express');
const multer = require('multer');
const { analyzeResume, getAnalysisById, getAllAnalyses, analyzeSample } = require("../controllers/resumeController.js");

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});

router.post('/api/analyze-resume', upload.single('resume'), analyzeResume);
router.get('/api/analysis/:id', getAnalysisById);
router.get('/api/analysis', getAllAnalyses);
router.post('/api/analyze-sample', analyzeSample);

module.exports = router;
