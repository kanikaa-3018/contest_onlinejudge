import React, { useState, useEffect } from "react";

const CodeEditor = ({ playgroundSrc = "https://onecompiler.com/javascript" }) => (
  <div className="mt-5 flex flex-col items-start w-full">
    <label className="font-semibold block mb-2 text-sm text-violet-200">
      Want to code? Instantly code and run:
    </label>
    <a
      href={playgroundSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full text-center inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600
                 text-white font-bold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-300
                 hover:from-indigo-600 hover:to-green-400 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/40 group
                 hover:-translate-y-0.5"
      style={{ fontSize: "1rem" }}
      title="Try code online with OneCompiler (opens in new tab)"
    >
      <span className="transition-all duration-300 group-hover:text-yellow-200 group-hover:scale-105">
        Try Coding (JavaScript)
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>Opens in new tab</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H2" />
      </svg>
    </a>
  </div>
);


const sheets = [
  {
    title: "Striver's SDE Sheet",
    emoji: "🚀",
    desc: "The most comprehensive SDE sheet for cracking coding interviews, curated by Striver.",
    link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    badge: "Popular",
    playgroundSrc: "https://onecompiler.com/javascript",
    quiz: [
      { question: "Which of these is NOT a topic in the SDE sheet?", options: ["Arrays", "Trees", "Sorting", "Blockchain"], answer: 3 },
      { question: "Who curated this SDE sheet?", options: ["Neetcode", "Fraz", "Striver", "Babbar"], answer: 2 },
    ],
  },
  {
    title: "NeetCode 150",
    emoji: "💡",
    desc: "NeetCode’s list of 150 essential LeetCode problems that are a must for interview preparation.",
    link: "https://neetcode.io/",
    badge: "",
    playgroundSrc: "https://onecompiler.com/javascript",
    quiz: [
      { question: "How many problems are in NeetCode's main list?", options: ["50", "100", "150", "200"], answer: 2 },
      { question: "NeetCode’s list is famous for which platform’s problems?", options: ["Codeforces", "LeetCode", "InterviewBit", "GFG"], answer: 1 },
    ],
  },
  {
    title: "Love Babbar 450 Sheet",
    emoji: "🔥",
    desc: "A popular 450-problem DSA sheet covering all topics.",
    link: "https://github.com/loveBabbar/450-DSA-Questions",
    badge: "Top Pick",
    playgroundSrc: "https://onecompiler.com/javascript",
    quiz: [
      { question: "How many questions are in Love Babbar's sheet?", options: ["100", "200", "350", "450"], answer: 3 },
      { question: "Which topic is NOT typically in the sheet?", options: ["String", "Hashing", "Web3", "Matrix"], answer: 2 },
    ],
  },
  {
    title: "Fraz 75 Sheet",
    emoji: "✨",
    desc: "Fraz’s 75 must-solve problems for interviews.",
    link: "https://takeuforward.org/interviews/frazs-striver-sde-sheet-top-coding-interview-problems/",
    badge: "",
    playgroundSrc: "https://onecompiler.com/javascript",
    quiz: [
      { question: "How many problems in Fraz’s list?", options: ["50", "60", "75", "100"], answer: 2 },
      { question: "Fraz’s list is best for which purpose?", options: ["DSA Basics", "System Design", "Interview Practice", "Web Dev"], answer: 2 },
    ],
  },
  {
    title: "Apna College DSA Sheet",
    emoji: "📚",
    desc: "A structured sheet from Apna College, with categories and video explanations.",
    link: "https://docs.google.com/spreadsheets/d/1whn5W1je3a8AwLdybCYrFzVzLqFJjPtT/edit#gid=0",
    badge: "",
    playgroundSrc: "https://onecompiler.com/javascript",
    quiz: [
      { question: "Who curates the Apna College sheet?", options: ["Aman Dhattarwal", "Striver", "Babbar", "Neetcode"], answer: 0 },
      { question: "Apna College sheet is known for including:", options: ["Dynamic Programming only", "System Design videos", "Video explanations & beginner focus", "Only competitive programming"], answer: 2 },
    ],
  },
];

const Learn = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('learnBookmarks');
    return saved ? JSON.parse(saved) : Array(sheets.length).fill(false);
  });
  useEffect(() => {
    localStorage.setItem('learnBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('learnCompleted');
    return saved ? JSON.parse(saved) : Array(sheets.length).fill(false);
  });
  useEffect(() => {
    localStorage.setItem('learnCompleted', JSON.stringify(completed));
  }, [completed]);

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('learnPoints');
    return saved ? Number(saved) : 0;
  });
  useEffect(() => {
    localStorage.setItem('learnPoints', points);
  }, [points]);
  const [streak] = useState(2);

  const [quizModal, setQuizModal] = useState({ open: false, index: null, qIdx: null });
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState(null);

  const toggleComplete = i => {
    let updated = [...completed];
    updated[i] = !updated[i];
    setCompleted(updated);
    if (updated[i]) setPoints(p => p + 5);
    else setPoints(p => (p > 5 ? p - 5 : 0));
  };
  const toggleBookmark = i => {
    let updated = [...bookmarks];
    updated[i] = !updated[i];
    setBookmarks(updated);
  };
  const openQuiz = i => {
    const qIdx = Math.floor(Math.random() * sheets[i].quiz.length);
    setQuizModal({ open: true, index: i, qIdx });
    setQuizAnswer(null);
    setQuizCorrect(null);
  };
  const handleQuizOption = idx => {
    const { index, qIdx } = quizModal;
    const correctAns = sheets[index].quiz[qIdx].answer;
    setQuizAnswer(idx);
    setQuizCorrect(idx === correctAns);
    if (idx === correctAns) setPoints(p => p + 10);
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500 bg-gradient-to-tr from-[#1e1830] via-[#142e5e] to-[#221537] text-[#F0ECE5]">
      {/* Points/Streak Row */}
      <div className="flex justify-end items-center p-4 max-w-4xl mx-auto">
        <div className="flex gap-4 items-center text-xs font-semibold">
          <span className="flex items-center gap-1"><span className="text-yellow-400 text-xl">🏅</span>Points: {points}</span>
          <span className="flex items-center gap-1"><span className="text-green-400 text-xl">🔥</span>Streak: {streak}d</span>
        </div>
      </div>

      {/* Hero/Banner */}
      <section className="relative py-10 flex flex-col items-center">
        <div className="absolute hidden md:block top-0 left-0 w-72 h-72 bg-purple-700/30 blur-2xl rounded-full -z-10 animate-pulse" />
        <div className="absolute hidden md:block bottom-0 right-0 w-60 h-60 bg-blue-600/30 blur-2xl rounded-full -z-10" />
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-center bg-gradient-to-r from-violet-400 via-blue-300 to-pink-300 bg-clip-text text-transparent">
          Level Up Your Coding Journey!
        </h2>
        <p className="text-lg md:text-xl text-center max-w-xl mx-auto mb-4">
          Handpicked DSA/coding resources & sheets to ace your next interview or coding round.
        </p>
      </section>

      {/* Resource Cards - two-column grid */}
      <div className="max-w-4xl mx-auto grid gap-8 px-4 grid-cols-1 md:grid-cols-2">
        {sheets.map((sheet, i) => (
          <div
            key={sheet.title}
            className="relative group rounded-2xl p-7 pt-8 shadow-xl border border-violet-900/70 hover:shadow-2xl hover:border-pink-500 bg-gradient-to-br from-[#292682] via-[#222445] to-[#2c2432] transition-all duration-200"
          >
            {/* Badge (absolute, right at the top right edge, floating like a sticker) */}
            {sheet.badge && (
  <div className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2 mr-14">
    <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-blue-400 text-white shadow-lg text-xs font-medium px-3 py-1 rounded-2xl">
      {sheet.badge}
    </span>
  </div>
)}


            {/* Title + emoji row, bookmark to the right */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-semibold">
                {sheet.title} <span className="ml-1 text-2xl align-middle">{sheet.emoji}</span>
              </span>
              <button onClick={() => toggleBookmark(i)} title="Bookmark">
                <span className={`text-xl ${bookmarks[i] ? "text-yellow-400" : "text-gray-400/70"} transition`}>★</span>
              </button>
            </div>
            <p className="mb-5 text-sm">{sheet.desc}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={() => openQuiz(i)}
                className="bg-gradient-to-r from-green-500 to-blue-400 hover:from-blue-500 hover:to-green-400 text-white font-semibold px-4 py-1 rounded-full"
              >
                Take Quiz
              </button>
              <button
                onClick={() => toggleComplete(i)}
                className={`font-semibold px-4 py-1 rounded-full border transition ${completed[i]
                  ? "border-green-400 text-green-400 bg-green-50/10"
                  : "border-gray-400/40 text-gray-200 bg-gray-800/30 hover:bg-green-500/20"
                }`}
              >
                {completed[i] ? "Completed ✓" : "Mark as Complete"}
              </button>
              <a
                href={sheet.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-400 hover:from-pink-600 hover:to-purple-500 text-white font-semibold px-4 py-1 rounded-full shadow transition-all duration-150"
              >
                View Resource
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H2" /></svg>
              </a>
            </div>
            <CodeEditor playgroundSrc={sheet.playgroundSrc} />
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {quizModal.open && (
        <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1e1830] text-gray-900 dark:text-gray-100 rounded-xl p-6 max-w-md shadow-lg relative animate-fade-in">
            <button onClick={() => setQuizModal({ open: false, index: null, qIdx: null })} className="absolute top-2 right-2 text-lg font-bold">
              ×
            </button>
            <h4 className="text-lg font-semibold mb-4">Quick Quiz</h4>
            {quizModal.index !== null && quizModal.qIdx !== null && (
              <>
                <p className="mb-4">{sheets[quizModal.index].quiz[quizModal.qIdx].question}</p>
                <div className="flex flex-col gap-2">
                  {sheets[quizModal.index].quiz[quizModal.qIdx].options.map((opt, idx) => (
                    <button
                      key={opt}
                      className={`block px-4 py-2 rounded ${quizAnswer === idx
                        ? quizCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-400 text-white"
                        : "bg-gray-200 dark:bg-[#222969] text-gray-700 dark:text-gray-100 hover:bg-blue-200 dark:hover:bg-purple-600"
                      }`}
                      disabled={quizAnswer !== null}
                      onClick={() => handleQuizOption(idx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <div className={`mt-4 font-bold ${quizCorrect ? "text-green-500" : "text-red-400"}`}>
                    {quizCorrect ? "Correct! +10 points" : "Oops, that's incorrect."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
