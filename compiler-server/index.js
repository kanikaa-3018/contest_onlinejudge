const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const executeCode = require("./dockerExecutor.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  executeCode(language, code, input || "", (result) => {
    res.json({ output: result });
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Compiler server running at http://localhost:${PORT}`);
});
