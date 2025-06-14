import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import socket from "../socket";
import axios from "axios";
import debounce from "lodash.debounce";

const BOILERPLATES = {
  javascript: `// JavaScript Boilerplate
function main() {
  console.log("Hello, JavaScript!");
}
main();`,

  python: `# Python Boilerplate
def main():
    print("Hello, Python!")

if __name__ == "__main__":
    main()`,

  java: `// Java Boilerplate
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,

  cpp: `// C++ Boilerplate
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
};

const COLORS = ["#FF4C4C", "#4C9AFF", "#4CFF88", "#FFB84C", "#9D4CFF"];

const CodeEditor = ({ roomId, userId }) => {
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const [code, setCode] = useState("// Start coding collaboratively...\n");
  const [language, setLanguage] = useState("javascript");
  const [remoteCursors, setRemoteCursors] = useState({});
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [codeEdited, setCodeEdited] = useState(false);

  const emitCodeChange = useRef(
    debounce((value) => {
      socket.emit("code-change", { roomId, code: value, userId });
    }, 300)
  ).current;

  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      socket.emit("cursor-move", { roomId, userId, position });
    });

    editor.onDidChangeModelContent(() => {
      if (isRemoteUpdate.current) return;

      const value = editor.getValue();
      setCode(value);
      setCodeEdited(true);
      emitCodeChange(value);
    });
  }

  useEffect(() => {
    socket.on("load-state", (state) => {
      if (state.code !== undefined) setCode(state.code);
      if (state.language !== undefined) setLanguage(state.language);
      if (state.input !== undefined) setInput(state.input);
      if (state.output !== undefined) setOutput(state.output);
    });

    socket.on("code-change", ({ code: newCode, userId: senderId }) => {
      if (senderId !== userId && editorRef.current) {
        const currentCode = editorRef.current.getValue();
        if (currentCode !== newCode) {
          isRemoteUpdate.current = true;
          editorRef.current.setValue(newCode);
          isRemoteUpdate.current = false;
        }
      }
    });

    socket.on("language-change", ({ language: newLang, userId: senderId }) => {
      if (senderId !== userId) setLanguage(newLang);
    });

    socket.on("cursor-move", ({ userId: senderId, position }) => {
      if (senderId !== userId) {
        setRemoteCursors((prev) => {
          const keys = Object.keys(prev);
          const colorIndex = keys.indexOf(senderId);
          const color =
            colorIndex === -1
              ? COLORS[keys.length % COLORS.length]
              : prev[senderId].color;
          return {
            ...prev,
            [senderId]: { position, color, name: `User ${senderId}` },
          };
        });
      }
    });

    socket.on("input-change", ({ input: newInput, userId: senderId }) => {
      if (senderId !== userId) setInput(newInput);
    });

    socket.on("output-change", ({ output: newOutput, userId: senderId }) => {
      if (senderId !== userId) setOutput(newOutput);
    });

    return () => {
      socket.off("load-state");
      socket.off("code-change");
      socket.off("cursor-move");
      socket.off("language-change");
      socket.off("input-change");
      socket.off("output-change");
    };
  }, [userId]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/execute`,
        {
          language,
          code,
          input,
        }
      );
      setOutput(response.data.output);
      socket.emit("output-change", {
        roomId,
        output: response.data.output,
        userId,
      });
    } catch (err) {
      setOutput("Error running code: " + err.message);
      socket.emit("output-change", {
        roomId,
        output: "Error running code: " + err.message,
        userId,
      });
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const decorations = Object.entries(remoteCursors).map(([id, cursor]) => {
      const { position, color, name } = cursor;
      return {
        range: new window.monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: "remote-cursor",
          beforeContentClassName: "remote-cursor-caret",
          afterContentClassName: "remote-cursor-label",
          stickiness:
            window.monaco.editor.TrackedRangeStickiness
              .NeverGrowsWhenTypingAtEdges,
          before: {
            content: " ",
            inlineClassName: "remote-caret",
          },
          after: {
            content: ` ${name}`,
            inlineClassName: "remote-label",
          },
        },
      };
    });

    const decorationIds = editorRef.current.deltaDecorations([], decorations);
    return () => {
      if (editorRef.current)
        editorRef.current.deltaDecorations(decorationIds, []);
    };
  }, [remoteCursors]);

  const onLanguageChange = (lang) => {
    setLanguage(lang);
    const boilerplate = BOILERPLATES[lang] || "";

    setCode(boilerplate);
    if (editorRef.current) {
      editorRef.current.setValue(boilerplate);
    }

    socket.emit("language-change", { roomId, language: lang, userId });
    socket.emit("code-change", { roomId, code: boilerplate, userId });

    // Optional: Reset codeEdited if you want language switch to re-enable boilerplate updates
    setCodeEdited(false);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #27272a",
          backgroundColor: "#252526",
          color: "#c5c6c7",
        }}
      >
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="h-8 w-[130px] text-xs bg-gray-900 text-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center gap-3">
          <div style={{ fontSize: 12, color: "#a1a1aa" }}>
            {code.split("\n").length} lines
          </div>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="my-4" style={{ flexGrow: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            cursorBlinking: "smooth",
            renderWhitespace: "all",
            automaticLayout: true,
            fontFamily: "JetBrains Mono, Fira Code, Consolas, Menlo, monospace",
          }}
        />
      </div>

      {/* Input and Output */}
      <div
        className="p-4 bg-[#1e1e1e] border-t border-gray-700 hide-scrollbar mb-6"
        style={{ maxHeight: "30vh", overflowY: "auto" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-1 block">
              Custom Input:
            </label>
            <textarea
              className="w-full p-2 border border-gray-700 rounded bg-[#252526] text-white resize-none"
              rows={5}
              placeholder="Enter input..."
              value={input}
              onChange={(e) => {
                const newInput = e.target.value;
                setInput(newInput);
                socket.emit("input-change", {
                  roomId,
                  input: newInput,
                  userId,
                });
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-1 block">
              Output:
            </label>
            <div className="w-full h-full p-2 border border-gray-700 rounded bg-[#252526] text-white overflow-y-auto max-h-40 hide-scrollbar">
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Remote cursor styles */}
      <style>{`
        .remote-cursor {
          position: relative;
        }
        .remote-caret {
          border-left: 2px solid transparent;
          height: 1em;
          vertical-align: bottom;
          margin-left: -1px;
          display: inline-block;
          position: relative;
          top: 0.1em;
          animation: blink 1.2s steps(5, start) infinite;
        }
        .remote-caret.inline {
          border-left-color: currentColor;
        }
        .remote-label {
          background-color: #007acc;
          color: white;
          font-size: 10px;
          border-radius: 3px;
          padding: 0 4px;
          margin-left: 5px;
          position: relative;
          top: -1.4em;
          white-space: nowrap;
          user-select: none;
        }
        .remote-caret {
          border-left-color: currentColor;
          border-left-style: solid;
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: currentColor; }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
