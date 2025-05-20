const express = require("express");
const router = express.Router();
const {
  saveInternship,
  getInternships
} = require("../controllers/internshipController.js");

router.post("/save", saveInternship);
router.get("/", getInternships);

module.exports = router;
