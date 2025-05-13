import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  //console.log(id)
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(boilerplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/questions/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setQuestion(data);
        // const fam= data.testCases[0]
        // console.log("ques",fam.input);
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

  const handleRun = async () => {
    setVerdict("Running...");
    setOutput("");
    try {
      const response = await fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMap[language],
          code,
          input,
        }),
      });

      const result = await response.json();
      if (result.output) {
        setOutput(result.output);
        setVerdict("Success");
      } else if (result.error) {
        setOutput(result.error);
        setVerdict("Error");
      } else {
        setOutput("Unknown error");
        setVerdict("Error");
      }
    } catch (err) {
      setOutput("Error executing code");
      setVerdict("Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#161A30] text-white p-6">
      {question ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Panel: Question Details */}
          <div className="bg-[#1E1E2E] p-6 rounded-xl shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-blue-400">
              {question.title}
            </h1>
            <p className="text-gray-300 leading-relaxed">
              {question.description}
            </p>

            {question.constraints && (
              <div className="bg-[#282c34] p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Constraints:
                </h3>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {question.constraints}
                </pre>
              </div>
            )}

            {(question.testCases[0].input || question.testCases[0].output) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(question.testCases[0].input) && (
                  <div className="bg-[#10131c] p-4 rounded-lg border border-[#2e354a]">
                    <h3 className="text-md font-medium text-gray-300 mb-1">
                      💡 Example Input
                    </h3>
                    <pre className="bg-[#1e1e2e] text-green-400 p-3 rounded overflow-auto whitespace-pre-wrap">
                      {question.testCases[0].input}
                    </pre>
                  </div>
                )}

                {(question.testCases[0].output )&& (
                  <div className="bg-[#10131c] p-4 rounded-lg border border-[#2e354a]">
                    <h3 className="text-md font-medium text-gray-300 mb-1">
                      ✅ Expected Output
                    </h3>
                    <pre className="bg-[#1e1e2e] text-yellow-300 p-3 rounded overflow-auto whitespace-pre-wrap">
                      {question.testCases[0].output }
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Code Editor UI */}
          <div className="space-y-4">
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
              <Button onClick={handleRun}>Submit</Button>
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

            <div className="mt-2 p-4 border rounded">
              <h3 className="text-white">Verdict:</h3>
              <p
                className={`text-lg ${
                  verdict === "Success"
                    ? "text-green-500"
                    : verdict === "Running..."
                    ? "text-yellow-400"
                    : "text-red-500"
                }`}
              >
                {verdict}: {output}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white">Loading question...</p>
      )}
    </div>
  );
};

export default CodeEditor;
