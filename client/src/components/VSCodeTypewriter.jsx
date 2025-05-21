import { useEffect, useState } from "react";

const colors = [
  "#ebedf0", // empty (light gray)
  "#c6f6d5", // light green
  "#9ae6b4",
  "#68d391",
  "#38a169", // dark green
];

// Grid config
const rows = 7;
const cols = 20;

const getRandomColor = () => {
  const weights = [0.15, 0.25, 0.3, 0.2, 0.1];
  const sum = weights.reduce((a,b) => a+b, 0);
  const rand = Math.random() * sum;
  let acc = 0;
  for (let i=0; i<weights.length; i++) {
    acc += weights[i];
    if (rand < acc) return colors[i];
  }
  return colors[0];
};

const VSCodeTypewriter = () => {
  const [output, setOutput] = useState("");
  const [gridColors, setGridColors] = useState(
    Array(rows * cols).fill(colors[0])
  );

  const fullText = [
    "AI Assistant: 'Ready to help you level up your coding skills!'",
    "AI Assistant: 'I can suggest problems based on your weaknesses and track your progress.'",
    "AI Assistant: 'Let’s get started with the next coding challenge!'",
  ].join("\n");

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setOutput((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Update grid colors smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setGridColors((prev) =>
        prev.map(() => getRandomColor())
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#161b22] rounded-xl shadow-xl text-gray-200 font-sans select-none">
      {/* Headline */}
      <h2 className="text-4xl font-semibold mb-8 text-center tracking-wide text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        GitHub Contribution Style AI Assistant
      </h2>

      {/* Contribution Graph */}
      <div
        className="grid grid-cols-20 grid-rows-7 gap-2 mb-10 justify-center"
        aria-label="GitHub contribution graph style"
      >
        {gridColors.map((color, i) => (
          <div
            key={i}
            style={{ backgroundColor: color, transition: "background-color 1s ease" }}
            className="w-5 h-5 rounded-sm shadow-sm"
            aria-hidden="true"
          />
        ))}
      </div>

      <hr className="border-gray-700 mb-8" />

      {/* Quotes Area */}
      <pre
        className="whitespace-pre-wrap font-mono text-lg leading-relaxed text-[#f0ab69] min-h-[120px] px-4 py-3 bg-[#0d1117] rounded-md shadow-inner"
        aria-live="polite"
        aria-atomic="true"
      >
        {output}
        <span className="inline-block w-1 h-6 bg-[#f0ab69] animate-pulse ml-1 align-bottom"></span>
      </pre>
    </div>
  );
};

export default VSCodeTypewriter;
