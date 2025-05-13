import React, { useState } from "react";
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

// Boilerplate code for different languages
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
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(boilerplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(boilerplates[languageMap[value]]);
  };

  const handleRun = async () => {
    try {
      const response = await fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMap[language], // Correctly mapped language
          code,
          input,
        }),
      });
      const result = await response.json();
      setOutput(result.output);
    } catch (err) {
      setOutput("Error executing code");
    }
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
  };

  return (
    <div className="p-4 space-y-4">
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
          height="400px"
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
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter test input here..."
          />
        </div>
        <div>
          <h3 className="text-white mb-2">Output</h3>
          <Textarea
            className="bg-[#1e1e1e] text-white"
            rows={6}
            value={output}
            readOnly
          />
        </div>
      </div>

      {/* Verdict block */}
      <div className="mt-4 p-4 border rounded">
        <h3 className="text-white">Verdict:</h3>
        <p
          className={`text-lg ${
            verdict === "Success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {verdict}: {output}
        </p>
      </div>
    </div>
  );
};

export default CodeEditor;
