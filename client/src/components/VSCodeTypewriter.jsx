import { useEffect, useState } from "react";
import { TerminalSquare } from "lucide-react";

const VSCodeTypewriter = () => {
  const [output, setOutput] = useState("");
  const fullText = [
    "AI Assistant: 'Ready to help you level up your coding skills!'",
    "AI Assistant: 'I can suggest problems based on your weaknesses and track your progress.'",
    "AI Assistant: 'Let’s get started with the next coding challenge!'",
  ].join("\n");

  // Typewriter Effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setOutput((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full max-w-[260px] mx-auto rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.7)] border border-[#2c313a] bg-[#1e1e1e] text-[#d4d4d4]"
      style={{ minWidth: "320px", fontFamily: "Consolas, 'Courier New', monospace" }}
    >
      {/* VS Code Style Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] select-none">
        <div className="flex items-center space-x-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #f1707a, #b03032)",
              boxShadow: "0 0 4px #f1707a",
            }}
          ></span>
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #f3d88c, #b38c00)",
              boxShadow: "0 0 4px #f3d88c",
            }}
          ></span>
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #4caf50, #2e7d32)",
              boxShadow: "0 0 4px #4caf50",
            }}
          ></span>
        </div>
        <span className="text-sm text-[#cccccc] truncate max-w-[150px]">
          AI Assistant
        </span>
        <TerminalSquare className="text-[#888888] w-4 h-4" />
      </div>

      {/* Terminal Output Area */}
      <div
        className="p-6 bg-[#1e1e1e] min-h-[180px] max-h-[220px] overflow-y-auto whitespace-pre-wrap overflow-x-auto"
        style={{ fontSize: "0.875rem", lineHeight: "1.4" }}
      >
        <pre className="leading-relaxed text-[#d4d4d4]">
          {output}
          <span className="inline-block w-2 h-5 ml-1 bg-[#d4d4d4] animate-blink cursor-shadow align-middle" />
        </pre>
      </div>

      <style jsx>{`
        .animate-blink {
          animation: blink-caret 1s step-start infinite;
          box-shadow: 0 0 8px 2px #d4d4d4;
          border-radius: 1px;
        }
        @keyframes blink-caret {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .cursor-shadow {
          filter: drop-shadow(0 0 4px #d4d4d4);
        }
      `}</style>
    </div>
  );
};

export default VSCodeTypewriter;
