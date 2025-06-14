import { useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import socket from "../socket";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const placeholderText = `# Project Documentation

## Overview
This is a collaborative project for...

## API Reference
- \`GET /api/resource\`: Fetches resources
- \`POST /api/resource\`: Creates a new resource

## TODO
- [ ] Implement authentication
- [ ] Add error handling
- [ ] Create user profiles
`;

const DocumentEditor = ({ roomId, userId }) => {
  const [content, setContent] = useState("");
  const isLocalUpdate = useRef(false);

  useEffect(() => {
    socket.on("load-state", (state) => {
      if (state.documentContent !== undefined) {
        setContent(state.documentContent);
      }
    });

    socket.on("document-change", ({ content: newContent, userId: senderId }) => {
      if (senderId !== userId) {
        setContent(newContent);
      }
    });

    return () => {
      socket.off("load-state");
      socket.off("document-change");
    };
  }, [userId]);

  const handleChange = (newValue) => {
    isLocalUpdate.current = true;
    setContent(newValue || "");
    socket.emit("document-change", { roomId, content: newValue || "", userId });
  };

  return (
    <div data-color-mode="dark" className="relative h-full p-6 bg-[#0d1117] rounded-xl border border-[#2c2f35] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">📄 Documentation</h2>
        <span className="text-sm text-green-400 font-mono">● Live Sync</span>
      </div>
{/* 
      Placeholder
      {content.trim() === "" && (
        <div className="absolute top-20 left-6 right-6 text-sm text-gray-600 whitespace-pre-wrap pointer-events-none z-10">
          {placeholderText}
        </div>
      )} */}

      <div className="rounded-md overflow-hidden">
        <MDEditor
          value={content}
          onChange={handleChange}
          height={500}
          preview="edit"
          textareaProps={{
            placeholder: "Start typing your docs here...",
            style: {
              padding: "1rem",
              fontSize: "14px",
              fontFamily: "JetBrains Mono, monospace",
            },
          }}
        />
      </div>
    </div>
  );
};

export default DocumentEditor;
