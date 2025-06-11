const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const executeCode = (language, code, input, callback) => {
  const id = uuid();
  const tempDir = path.join(__dirname, "temp", id);
  fs.mkdirSync(tempDir, { recursive: true });

  const codeFileMap = {
    cpp: "code.cpp",
    python: "code.py",
    java: "Main.java",
    javascript: "code.js",
  };

  const codeFile = path.join(tempDir, codeFileMap[language]);
  const inputFile = path.join(tempDir, "input.txt");
  const outputFile = path.join(tempDir, "output.txt");

  fs.writeFileSync(codeFile, code);
  fs.writeFileSync(inputFile, input);

  let command = "";

  if (language === "cpp") {
    command = `g++ ${codeFile} -o ${tempDir}/a.out && ${tempDir}/a.out < ${inputFile} > ${outputFile}`;
  } else if (language === "python") {
    command = `python3 ${codeFile} < ${inputFile} > ${outputFile}`;
  } else if (language === "java") {
    command = `javac ${codeFile} && java -cp ${tempDir} Main < ${inputFile} > ${outputFile}`;
  } else if (language === "javascript") {
    command = `node ${codeFile} < ${inputFile} > ${outputFile}`;
  } else {
    return callback(null, "Unsupported language");
  }

  exec(command, { cwd: tempDir }, (error, stdout, stderr) => {
    let output = "";

    if (error || stderr) {
      callback(null, stderr || error.message);
    } else {
      try {
        output = fs.readFileSync(outputFile, "utf8");
        callback(output, null); // ✅ Corrected: success
      } catch (readErr) {
        callback(null, "Error reading output file.");
      }
    }

    // Clean up
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.error("Cleanup failed:", cleanupErr);
    }
  });
};

module.exports = executeCode;
