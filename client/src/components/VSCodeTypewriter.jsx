import { useEffect, useState } from "react";

const VSCodeTypewriter = () => {
  const [output, setOutput] = useState("");
  const textLines = [
    "const aiAssistant = {",
    "  task: 'Assisting with coding challenges...'",
    "  currentTask: 'Analyzing your recent submissions...'",
    "  recommendations: ['Focus on dynamic programming', 'Try solving graph-based problems']",
    "  stats: {",
    "    problemsSolved: '150+ problems solved this month',",
    "    contestParticipation: '5 contests participated this week',",
    "    timeSpent: '20 hours coding this week',",
    "  },",
    "};",
    "",
    "AI Assistant: 'Ready to help you level up your coding skills!'",
    "AI Assistant: 'I can suggest problems based on your weaknesses and track your progress.'",
    "AI Assistant: 'Let’s get started with the next coding challenge!'",
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentOutput = "";

    const typeInterval = setInterval(() => {
      if (charIndex < textLines[lineIndex].length) {
        currentOutput += textLines[lineIndex].charAt(charIndex);
        setOutput(currentOutput); 
        charIndex++;
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex >= textLines.length) {
          clearInterval(typeInterval);
        } else {
          currentOutput += "\n"; 
        }
      }
    }, 80); 

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#1e1e1e] text-white rounded-lg shadow-lg">
      {/* Simulated VS Code Structure */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center bg-[#252526] p-2 rounded-t-lg">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
          </div>
          <div className="text-xs text-[#d4d4d4]">AI Assistant</div>
        </div>

        {/* Typewriter Effect */}
        <div className="p-6 text-sm font-mono leading-tight space-y-2 whitespace-pre-wrap">
          <p className="text-[#9CDCFE]">{output}</p>
        </div>

        {/* Blinking Cursor */}
        <div className="mt-4 text-[#D4D4D4] animate-cursor">_</div>
      </div>
    </div>
  );
};

export default VSCodeTypewriter;
