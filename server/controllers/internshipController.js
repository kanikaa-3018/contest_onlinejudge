const Internship = require("../models/internshipModel.js");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const fetch = require("node-fetch");

const saveInternship = async (req, res) => {
  const { html } = req.body;
  try {
    const n8nRes = await fetch(
      "https://imtkanika.app.n8n.cloud/webhook-test/scrape-internship",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      }
    );

    if (!n8nRes.ok) {
      throw new Error(`n8n webhook error: ${n8nRes.statusText}`);
    }

    const responseArray = await n8nRes.json();
    
    const internshipData = responseArray[0].output;
    const internship = new Internship(internshipData);
    const savedInternship = await internship.save();

    res
      .status(200)
      .json({
        message: "Parsed and saved successfully",
        data: savedInternship,
      });
  } catch (error) {
    console.error("Error talking to n8n or saving internship:", error);
    res.status(500).json({ message: "Failed to process and save internship" });
  }
};

const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};

module.exports = { saveInternship, getInternships };
