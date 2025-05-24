import { useState, useEffect, useRef } from "react";
import socket from "../socket.js"; // your socket instance
import { useParams } from "react-router-dom";

const initialDoc = `# Project Documentation

## Overview
This is a collaborative project for...

## API Reference
- \`GET /api/resource\`: Fetches resources
- \`POST /api/resource\`: Creates a new resource

## TODO
- [ ] Implement authentication
- [ ] Add error handling
- [ ] Create user profiles`;

const DocumentEditor = ({ initialContent = initialDoc, onContentChange, className }) => {
  const { id: roomId } = useParams();
  const [content, setContent] = useState(initialContent);
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const userId = userFromStorage?._id || "unknown";
  const isLocalUpdate = useRef(false);

  
  const handleChange = (e) => {
    const newContent = e.target.value;
    isLocalUpdate.current = true;
    setContent(newContent);
    socket.emit("document-change", { roomId, content: newContent, userId });
  };

  
  useEffect(() => {
    socket.on("load-state", (state) => {
      if (state.documentContent !== undefined) setContent(state.documentContent);
    });

    const handleDocUpdate = ({ content: newContent, userId: senderId }) => {
      if (senderId !== userId) {
        isLocalUpdate.current = false;
        setContent(newContent);
      }
    };

    socket.on("document-change", handleDocUpdate);

    return () => {
      socket.off("document-change", handleDocUpdate);
      socket.off("load-state")
    };
  }, [userId]);

  
  useEffect(() => {
    if (onContentChange && isLocalUpdate.current) {
      onContentChange(content);
      isLocalUpdate.current = false;
    }
  }, [content, onContentChange]);

  return (
    <div
      className={`flex h-full flex-col rounded-md border ${className}`}
      style={{ borderColor: "#27272a" }}
    >
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{ borderColor: "#27272a" }}
      >
        <span className="text-sm font-medium">Documentation</span>
        <span className="text-xs" style={{ color: "#a1a1aa" }}>
          Markdown supported
        </span>
      </div>
      <textarea
        className="h-full w-full resize-none p-4 text-sm leading-relaxed focus:outline-none"
        style={{ backgroundColor: "#0f0f23", color: "#e4e4e7", fontFamily: "monospace" }}
        value={content}
        onChange={handleChange}
        placeholder="Write your documentation here..."
        spellCheck={false}
      />
    </div>
  );
};

export default DocumentEditor;
