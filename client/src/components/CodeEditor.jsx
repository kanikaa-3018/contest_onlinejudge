import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"; // Your custom select UI component
import socket from "../socket"; // Your socket.io client instance

const COLORS = ["#FF4C4C", "#4C9AFF", "#4CFF88", "#FFB84C", "#9D4CFF"];

const CodeEditor = ({ roomId, userId }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("// Start coding collaboratively...\n");
  const [language, setLanguage] = useState("javascript");
  const [remoteCursors, setRemoteCursors] = useState({}); // { userId: { position, color, name } }

  // Save editor instance on mount
  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      socket.emit("cursor-move", {
        roomId,
        userId,
        position,
      });
    });

    // Listen to code changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
      socket.emit("code-change", { roomId, code: value, userId });
    });
  }

  // Receive code changes and cursor updates from others
  useEffect(() => {
    socket.on("code-change", ({ code: newCode, userId: senderId }) => {
      if (senderId !== userId && editorRef.current) {
        const currentCode = editorRef.current.getValue();
        if (currentCode !== newCode) {
          editorRef.current.setValue(newCode);
        }
      }
    });
    socket.on("language-change", ({ language: newLang, userId: senderId }) => {
      if (senderId !== userId) {
        setLanguage(newLang);
      }
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
          return { ...prev, [senderId]: { position, color, name: `User ${senderId}` } };
        });
      }
    });

    return () => {
      socket.off("code-change");
      socket.off("cursor-move");
      socket.off("language-change");
    };
  }, [userId]);

  // Update decorations for remote cursors
  useEffect(() => {
    if (!editorRef.current) return;

    // Remove old decorations and add new ones
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
            window.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
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
      if (editorRef.current) editorRef.current.deltaDecorations(decorationIds, []);
    };
  }, [remoteCursors]);


  const onLanguageChange = (lang) => {
    setLanguage(lang);
    socket.emit("language-change", { roomId, language: lang, userId });
  };

  return (
    <div
      style={{
        height: "600px",
        border: "1px solid #27272a",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
          </SelectContent>
        </Select>
        <div style={{ fontSize: 12, color: "#a1a1aa" }}>
          {code.split("\n").length} lines
        </div>
      </div>

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

      {/* Styles for remote cursors */}
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
