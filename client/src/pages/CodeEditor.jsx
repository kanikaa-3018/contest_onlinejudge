import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

const boilerplates = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`,
  python: `# your code goes here
print("Hello, world!")`,
  java: `public class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}`,
  javascript: `// your code goes here
console.log("Hello, world!");`,
};

const languageMap = {
  "C++": "cpp",
  Python: "python",
  Java: "java",
  JavaScript: "javascript",
};

const CodeEditor = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [hints, setHints] = useState([]);
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(boilerplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [failedCaseIndex, setFailedCaseIndex] = useState(-1);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));



  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/questions/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setQuestion(data);
        setTotalTestCases(data.testCases.length || 0);
      } catch (err) {
        console.error("Failed to fetch question", err);
        setQuestion(null);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(boilerplates[languageMap[value]]);
  };

  const generateHint = async (questionID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/questions/generate-hints/${questionID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Normalize and extract hints from the response
      if (typeof data.hints === "string") {
        const hintArray = data.hints
          .split(/\d+\.\s+/)
          .map((hint) => hint.trim())
          .filter((hint) => hint.length > 0);
        setHints(hintArray);
      } else if (Array.isArray(data.hints)) {
        setHints(data.hints.map((h) => h.trim()));
      }

      console.log("hints", data.hints);
    } catch (err) {
      console.error("Error fetching hints:", err);
      setHints(["Error fetching hint."]);
    }
  };

  const handleRun = async () => {
    setVerdict("Running...");
    setOutput("");
    try {
      const response = await fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languageMap[language],
          code,
          input,
        }),
      });
      const result = await response.json();

      if (result.output) {
        setOutput(result.output);

        if (
          result.output.includes("Traceback") ||
          result.output.toLowerCase().includes("error") ||
          result.output.toLowerCase().includes("exception")
        ) {
          setVerdict("Failed");
        } else {
          setVerdict("Success");
        }
      } else {
        setOutput(result.error || "Unknown error");
        setVerdict("Failed");
      }
    } catch (err) {
      setOutput("Error executing code");
      setVerdict("Failed");
    }
  };

  const handleSubmit = async () => {
    setVerdict("Running all test cases...");
    setOutput("");
    setTestCaseResults([]);

    try {
      const response = await fetch(
        `http://localhost:8080/api/questions/${id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: languageMap[language],
            code,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setOutput("All test cases passed!");
        setVerdict("Success");
        setFailedCaseIndex(-1);
        setTestCaseResults(Array(totalTestCases).fill({ passed: true }));

        const response2= await fetch("http://localhost:8080/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id, 
            questionId: id,
            code,
            language,
            status: "Success",
          }),
        });
        const data= await response2.json();
        console.log(response2)
      } else {
        setVerdict("Failed");
        setFailedCaseIndex(result.failedCaseIndex);
        const resultsArray = [];
        for (let i = 0; i < totalTestCases; i++) {
          if (i < result.failedCaseIndex) {
            resultsArray.push({ passed: true });
          } else if (i === result.failedCaseIndex) {
            resultsArray.push({
              passed: false,
              expected: result.expected,
              actual: result.actual,
            });
          } else {
            resultsArray.push({ passed: null }); 
          }
        }
        setTestCaseResults(resultsArray);

        setOutput(
          `Failed on test case #${result.failedCaseIndex + 1}.\nExpected: ${
            result.expected
          }\nGot: ${result.actual}`
        );

        await fetch("http://localhost:8080/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            questionId: id,
            code,
            language,
            status: "Failed",
          }),
        });
      }
    } catch (err) {
      setOutput("Submission error");
      setVerdict("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#161A30] text-white p-4">
      {question ? (
        <Split
          className="flex h-[calc(100vh-40px)] gap-4"
          sizes={[50, 50]}
          minSize={300}
          gutterSize={10}
          direction="horizontal"
        >
          {/* Left Panel */}
          <div className="bg-[#1E1E2E] p-6 rounded-xl shadow-lg overflow-auto">
            <h1 className="text-3xl font-bold text-blue-400">
              {question.title}
            </h1>
            <p className="text-gray-300 mt-4 leading-relaxed">
              {question.description}
            </p>

            {question.constraints && (
              <div className="p-4 mt-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {question.constraints}
                </pre>
              </div>
            )}

            {question.testCases.slice(0, 2).map((tc, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3"
              >
                {tc.input && (
                  <div className="bg-[#10131c] p-4 rounded-lg border border-[#2e354a]">
                    <h3 className="text-md font-medium text-gray-300 mb-1 mt-1">
                      💡 Input #{index + 1}
                    </h3>
                    <pre className="bg-[#1e1e2e] text-green-400 p-3 rounded overflow-auto whitespace-pre-wrap">
                      {tc.input}
                    </pre>
                  </div>
                )}
                {tc.output && (
                  <div className="bg-[#10131c] p-4 rounded-lg border border-[#2e354a]">
                    <h3 className="text-md font-medium text-gray-300 mb-1 mt-1">
                      ✅ Output #{index + 1}
                    </h3>
                    <pre className="bg-[#1e1e2e] text-yellow-300 p-3 rounded overflow-auto whitespace-pre-wrap">
                      {tc.output}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6">
              <Button variant="outline" onClick={() => generateHint(id)}>
                💡 Generate Hint
              </Button>

              {hints && hints.length > 0 ? (
                <div className="my-4">
                  <Accordion type="multiple" className="w-full">
                    {hints.map((hint, index) => (
                      <AccordionItem key={index} value={`hint-${index}`}>
                        <AccordionTrigger>Hint {index + 1}</AccordionTrigger>
                        <AccordionContent>{hint}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-4">
                  No hints available.
                </p>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col space-y-4 overflow-auto p-2">
            <div className="flex justify-between items-center">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-x-2">
                <Button variant="secondary" onClick={handleRun}>
                  Run
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </div>

            <div className="border rounded overflow-hidden">
              <Editor
                height="300px"
                language={languageMap[language]}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white mb-2">Input</h3>
                <Textarea
                  className="bg-[#1e1e1e] text-white"
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter test input here..."
                />
              </div>
              <div>
                <h3 className="text-white mb-2">Output</h3>
                <Textarea
                  className="bg-[#1e1e1e] text-white"
                  rows={4}
                  value={output}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-2 p-4 border rounded bg-[#1e1e2f]">
              <h3 className="text-white text-lg font-semibold mb-2">
                Verdict:
              </h3>
              <p
                className={`text-lg mb-4 ${
                  verdict === "Success"
                    ? "text-green-500"
                    : verdict === "Running all test cases..." ||
                      verdict === "Running..."
                    ? "text-yellow-400"
                    : verdict === "Failed"
                    ? "text-red-500"
                    : "text-white"
                }`}
              >
                {verdict ? `${verdict}: ${output}` : ""}
              </p>

              {/* Show test cases only if verdict is not empty, not running, and totalTestCases > 0 */}
              {verdict &&
                verdict !== "Running all test cases..." &&
                totalTestCases > 0 && (
                  <div className="flex space-x-2 flex-wrap">
                    {[...Array(totalTestCases).keys()].map((idx) => {
                      const isPassed =
                        verdict === "Success" || idx !== failedCaseIndex;
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded text-white text-sm font-medium ${
                            isPassed ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          Testcase {idx + 1}
                        </span>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </Split>
      ) : (
        <p className="text-white">Loading question...</p>
      )}
    </div>
  );
};

export default CodeEditor;
