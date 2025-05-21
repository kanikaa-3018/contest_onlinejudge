import React, { useRef } from "react";
import {
  Sparkles,
  TestTubes,
  Lightbulb,
  FileBarChart2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles size={32} className="text-indigo-500 mb-4" />,
    title: "Smart Code Suggestions",
    description: "AI analyzes your code and suggests improvements in real-time.",
  },
  {
    icon: <TestTubes size={32} className="text-purple-500 mb-4" />,
    title: "Automated Test Case Generation",
    description: "Generate edge cases and comprehensive tests automatically with AI-powered insights.",
  },
  {
    icon: <Lightbulb size={32} className="text-yellow-500 mb-4" />,
    title: "Hints Generation Using AI",
    description: "Get AI-generated hints tailored to your problem-solving approach for faster learning.",
  },
  {
    icon: <FileBarChart2 size={32} className="text-emerald-500 mb-4" />,
    title: "Automatic Report Analysis",
    description: "AI processes your coding reports and offers actionable insights to improve performance.",
  },
  {
    icon: <Briefcase size={32} className="text-pink-500 mb-4" />,
    title: "Internship Tracking Agent",
    description: "Keep track of your internship applications and deadlines with AI reminders and suggestions.",
  },
];

const AIIntegrationShowcase = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 relative">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100">
        AI Integrations That Empower You
      </h2>

      {/* Scroll Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 translate-y-4 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:scale-110 transition"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 translate-y-4 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:scale-110 transition"
      >
        <ChevronRight size={28} />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto snap-x snap-mandatory py-4 px-8 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {features.map(({ icon, title, description }) => (
          <div
            key={title}
            className="snap-center flex-shrink-0 w-80 p-10 bg-white dark:bg-gray-900 rounded-2xl
              shadow-md dark:shadow-black/40 transition-all duration-300 cursor-pointer
              transform hover:scale-105 hover:-translate-y-1
              hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)]
              border-2 border-transparent relative overflow-hidden
              hover:border-gradient-to-r hover:border-indigo-500 hover:from-indigo-400 hover:via-purple-500 hover:to-pink-500"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 blur-[25px]"></div>

            <div className="relative flex flex-col items-center text-center">
              {icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIIntegrationShowcase;
