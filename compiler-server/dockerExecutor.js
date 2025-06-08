// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");
// const { v4: uuid } = require("uuid");

// const executeCode = (language, code, input, callback) => {
//   const id = uuid();
//   const tempDir = path.join(__dirname, "temp", id);
//   fs.mkdirSync(tempDir, { recursive: true });

//   const codeFile = path.join(tempDir, `code.${language}`);
//   const inputFile = path.join(tempDir, "input.txt");
//   const outputFile = path.join(tempDir, "output.txt");

//   fs.writeFileSync(codeFile, code);
//   fs.writeFileSync(inputFile, input);

//   const volumeMount = tempDir.replace(/\\/g, "/");

//   let dockerCommand = "";
//   if (language === "cpp") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app cpp-code-executor bash -c "g++ /app/code.cpp -o /app/a.out && /app/a.out < /app/input.txt | tee /app/output.txt"`;
//   } else if (language === "python") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app python:3.10 bash -c "python3 /app/code.python < /app/input.txt | tee /app/output.txt"`;
//   } else if (language === "java") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app openjdk:17 bash -c "javac /app/code.java && java -cp /app Main < /app/input.txt | tee /app/output.txt"`;
//   } else if (language === "javascript") {
//     dockerCommand = `docker run --rm -v ${volumeMount}:/app node:20 bash -c "node /app/code.javascript < /app/input.txt | tee /app/output.txt"`;
//   }

//   exec(dockerCommand, (error, stdout, stderr) => {
//     if (error || stderr) {
//       return callback(stderr || error.message);
//     }

//     try {
//       const output = fs.readFileSync(outputFile, "utf8");
//       callback(output);
//     } catch (err) {
//       callback("Error reading output file.");
//     }

    
//     fs.rmSync(tempDir, { recursive: true, force: true });
//   });
// };

// module.exports = executeCode;


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

  // Commands per language
  let command = "";

  if (language === "cpp") {
    command = `g++ ${codeFile} -o ${tempDir}/a.out && ${tempDir}/a.out < ${inputFile} > ${outputFile}`;
  } else if (language === "python") {
    command = `python3 ${codeFile} < ${inputFile} > ${outputFile}`;
  } else if (language === "java") {
    command = `javac ${codeFile} && java -cp ${tempDir} Main < ${inputFile} > ${outputFile}`;
  } else if (language === "javascript") {
    command = `node ${codeFile} < ${inputFile} > ${outputFile}`;
  }

  exec(command, { cwd: tempDir }, (error, stdout, stderr) => {
    if (error || stderr) {
      return callback(stderr || error.message);
    }

    try {
      const output = fs.readFileSync(outputFile, "utf8");
      callback(output);
    } catch (err) {
      callback("Error reading output file.");
    }

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
};

module.exports = executeCode;

