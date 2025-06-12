const express = require("express");
const cors = require("cors");
const http = require("http");
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
const submissionRoutes = require("./routes/submissionRoutes");
const resumeRoutes= require("./routes/resumeRoutes.js")
const roomRoutes = require("./routes/roomRoutes.js");
const aiRoutes= require("./routes/ai.js")
const {initSocket}= require("./socket.js")
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const app = express();
connectDB();

const dockerurl=process.env.COMPILER_SERVER_URL;

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
initSocket(server);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Online Judge API" });
});

app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/rooms", roomRoutes);
app.use(resumeRoutes)
app.use("/api/ai", aiRoutes)

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

// const executeCode = (language, code, input, callback) => {
//   // console.log("Received language:", language);

//   const codeFile = `code.${language}`;
//   const inputFile = "input.txt";
//   const outputFile = "output.txt";

//   if (fs.existsSync(outputFile)) {
//     fs.unlinkSync(outputFile);
//   }

//   fs.writeFileSync(codeFile, code);
//   fs.writeFileSync(inputFile, input);

//   const volumeMount = path
//     .resolve(__dirname)
//     .replace(/\\/g, "/")
//     .replace(/^([a-zA-Z]):/, "/$1");

//   let dockerCommand = "";
//   if (language === "cpp") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app cpp-code-executor bash -c "mkdir -p /app && g++ /app/${codeFile} -o /app/a.out && /app/a.out < /app/${inputFile} | tee /app/${outputFile}"`;
//   } else if (language === "python") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app python:3.10 bash -c "mkdir -p /app && python3 /app/${codeFile} < /app/${inputFile} | tee /app/${outputFile}"`;
//   } else if (language === "java") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app openjdk:17 bash -c "mkdir -p /app && javac /app/${codeFile} && java -cp /app Main < /app/${inputFile} | tee /app/${outputFile}"`;
//   } else if (language === "javascript") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app node:20 bash -c "mkdir -p /app && node /app/${codeFile} < /app/${inputFile} | tee /app/${outputFile}"`;
//   }
  

//   // console.log("Volume Mount:", volumeMount);
//   // console.log("Docker Command:", dockerCommand);

//   exec(dockerCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error("Error executing Docker command:", error);
//       callback(stderr || error.message);
//     } else if (stderr) {
//       console.error("Error in code execution:", stderr);
//       callback(stderr);
//     } else {
//       try {
//         const output = fs.readFileSync(outputFile, "utf8");
//         callback(output);
//       } catch (err) {
//         callback("Error reading output file.");
//       }

//       // Clean up files
//       try {
//         fs.unlinkSync(codeFile);
//         fs.unlinkSync(inputFile);
//         if (fs.existsSync(outputFile)) {
//           fs.unlinkSync(outputFile);
//         }
//       } catch (cleanupErr) {
//         console.error("Error cleaning up files:", cleanupErr);
//       }
//     }
//   });
// };

// app.post("/execute", (req, res) => {
//   const { language, code, input } = req.body;
//   executeCode(language, code, input, (result) => {
//     res.json({ output: result });
//   });
// });

app.post("/execute", async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const response = await axios.post(`${dockerurl}/run`, {
      language,
      code,
      input,
    });

    res.json({ output: response.data.output });
  } catch (err) {
    console.error("Error executing code:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Compiler server error." });
  }
});


app.post('/analyze', async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze the following ${language} code. Give feedback on:
- Code quality
- Readability
- Optimization
- Maintainability
- Any bugs or issues
Just include useful and important feedback and keep it easy to understand.
Code:\n\n${code}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      res.json({ feedback: data.candidates[0].content.parts[0].text });
    } else {
      console.error("No candidates in response:", JSON.stringify(data));
      res.status(500).json({ message: "Gemini did not return valid feedback." });
    }
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Failed to analyze code with Gemini." });
  }
});


const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
