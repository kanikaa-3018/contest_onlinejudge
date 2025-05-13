const express = require("express");
const router = express.Router();
const { getProgressByEmail } = require("../controllers/progressController.js");

router.post("/", getProgressByEmail);

module.exports = router;
