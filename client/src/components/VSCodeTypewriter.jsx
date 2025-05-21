import { useEffect, useState } from "react";

const colors = [
  "#ebedf0", // empty
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

// Generate a 7x20 grid to mimic GitHub contribution graph
const rows = 7;
const cols = 20;

const getRandomColor = () => {
  // Randomly pick a color weighted towards green shades (not empty)
  const weights = [0.2, 0.2, 0.25, 0.25, 0.1]; // example weights
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

  // Typewriter effect for quotes (same as before, but shorter quotes)
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setOutput((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Update grid colors randomly every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setGridColors((prev) =>
        prev.map(() => getRandomColor())
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // No syntax highlighting here, just show output text with quotes styling
  // But I will keep a simple styling for quotes (orange-ish)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0d1117] rounded-lg shadow-lg text-white font-sans select-none">
      {/* Headline */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Your GitHub Style AI Assistant
      </h2>

      {/* Contribution graph grid */}
      <div className="grid grid-cols-20 grid-rows-7 gap-1 mb-8 justify-center">
        {gridColors.map((color, i) => (
          <div
            key={i}
            style={{ backgroundColor: color }}
            className="w-4 h-4 rounded-sm"
          />
        ))}
      </div>

      {/* Typed quotes area */}
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#f0ab69] min-h-[100px]">
        {output}
        <span className="animate-pulse">|</span>
      </pre>
    </div>
  );
};

export default VSCodeTypewriter;
