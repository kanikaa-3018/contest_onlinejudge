const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const executeCode = require("./dockerExecutor.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  try {
    executeCode(language, code, input || "", (result) => {
      res.json({ output: result });
    });
  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
