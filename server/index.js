const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { exec, spawn } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
dotenv.config();
const connectDB = require("./db/connectDB.js");
const progressRoutes = require("./routes/progress.js");
const userRoutes = require("./routes/userRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");
const internshipRoutes = require("./routes/internshipRoutes.js");

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Online Judge API" });
});

app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/internships", internshipRoutes);

//for test-case generation using python scripts
// app.post("/api/generate-tests", async (req, res) => {
//   const { code } = req.body;
//   console.log(code);
//   if (!code) {
//     return res.status(400).json({ error: "Code is required" });
//   }

//   try {
//     // Forward request to your Python Flask API running on port 5001
//     const response = await axios.post("http://localhost:5001/generate-tests", {
//       code,
//     });

//     if (response.data.tests) {
//       return res.json({ success: true, tests: response.data.tests });
//     } else {
//       return res
//         .status(500)
//         .json({ success: false, error: "No test cases generated" });
//     }
//   } catch (error) {
//     console.error("Error generating tests:", error.message);
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to generate test cases" });
//   }
// });

app.get("/api/global-leaderboard", async (req, res) => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/user.ratedList?activeOnly=true&includeRetired=false"
    );
    res.json(response.data.result);
  } catch (error) {
    console.error("Error fetching global leaderboard:", error.message);
    res.status(500).json({ error: "Failed to fetch global leaderboard" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const executeCode = (language, code, input, callback) => {
  // console.log("Received language:", language);

  const codeFile = `code.${language}`;
  const inputFile = "input.txt";
  const outputFile = "output.txt";

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  fs.writeFileSync(codeFile, code);
  fs.writeFileSync(inputFile, input);

  const volumeMount = path
    .resolve(__dirname)
    .replace(/\\/g, "/")
    .replace(/^([a-zA-Z]):/, "/$1");

  let dockerCommand = "";
  if (language === "cpp") {
    dockerCommand = `docker run --rm -v ${volumeMount}:/app cpp-code-executor bash -c "g++ /app/${codeFile} -o /app/a.out && /app/a.out < /app/${inputFile} > /app/${outputFile}"`;
  } else if (language === "python") {
    dockerCommand = `docker run --rm -v ${volumeMount}:/app python:3.10 bash -c "python3 /app/${codeFile} < /app/${inputFile} > /app/${outputFile}"`;
  } else if (language === "java") {
    dockerCommand = `docker run --rm -v ${volumeMount}:/app openjdk:17 bash -c "javac /app/${codeFile} && java -cp /app Main < /app/${inputFile} > /app/${outputFile}"`;
  } else if (language === "javascript") {
    dockerCommand = `docker run --rm -v ${volumeMount}:/app node:20 bash -c "node /app/${codeFile} < /app/${inputFile} > /app/${outputFile}"`;
  }

  // console.log("Volume Mount:", volumeMount);
  // console.log("Docker Command:", dockerCommand);

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing Docker command:", error);
      callback(stderr || error.message);
    } else if (stderr) {
      console.error("Error in code execution:", stderr);
      callback(stderr);
    } else {
      try {
        const output = fs.readFileSync(outputFile, "utf8");
        callback(output);
      } catch (err) {
        callback("Error reading output file.");
      }

      // Clean up files
      try {
        fs.unlinkSync(codeFile);
        fs.unlinkSync(inputFile);
        if (fs.existsSync(outputFile)) {
          fs.unlinkSync(outputFile);
        }
      } catch (cleanupErr) {
        console.error("Error cleaning up files:", cleanupErr);
      }
    }
  });
};

app.post("/execute", (req, res) => {
  const { language, code, input } = req.body;
  executeCode(language, code, input, (result) => {
    res.json({ output: result });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
