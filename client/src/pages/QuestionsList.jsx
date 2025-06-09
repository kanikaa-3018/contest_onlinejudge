import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { FaFolderOpen, FaLock } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  BarChart3,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const statusColors = {
  Success: "bg-green-600 text-green-100",
  Failed: "bg-red-600 text-red-100",
  "Not Attempted": "bg-gray-600 text-gray-300",
};

const Tabs = ["Practice Questions", "My Submissions", "Coming Soon"];

const QuestionsList = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [activeLang, setActiveLang] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProficiency, setAiProficiency] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchAIInsights = async () => {
    setAiLoading(true);
    try {
      const res1 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/proficiency`,
        {
          submissions,
        }
      );
      const res2 = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/suggestion`,
        {
          submissions,
        }
      );

      setAiProficiency(res1.data?.candidates?.[0]?.content?.parts?.[0]?.text);
      setAiSuggestion(res2.data?.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (err) {
      console.error("AI fetch failed", err);
    } finally {
      setAiLoading(false);
    }
  };

  const formatSuggestion = (text) => {
    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-yellow-400 font-semibold">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="text-emerald-400 italic">$1</em>')
      .replace(
        /(C\+\+|Python|string manipulation|loops|input|syntax error|arithmetic|success|failure)/gi,
        (match) =>
          `<span class="text-pink-400 font-semibold animate-pulse">${match}</span>`
      );
  };

  const formatProficiency = (text) => {
    return (
      text

        .replace(
          /Proficiency Score: (\d+)\/100/,
          `<div class="text-xl font-bold text-cyan-300 mb-1">Proficiency Score: $1/100</div>`
        )
        // Section Headings with smaller bottom margin
        .replace(
          /Explanation:/g,
          '<h4 class="text-lg font-semibold text-sky-400 mt-4 mb-1">📘 Explanation</h4>'
        )
        .replace(
          /Breakdown:/g,
          '<h4 class="text-lg font-semibold text-blue-400 mt-4 mb-1">📊 Breakdown</h4>'
        )
        .replace(
          /In conclusion,/g,
          '<h4 class="text-lg font-semibold text-purple-400 mt-4 mb-1">🧠 Conclusion</h4><p>'
        )
        // Bullet points
        .replace(
          /\* (.*?)\n/g,
          '<li class="ml-6 text-sm text-gray-300">$1</li>'
        )
        // Remove ** bold marks
        .replace(/\*\*(.*?)\*\*/g, "$1")
        // Wrap <li> inside <ul> only once per group (improved)
        .replace(
          /(?:<li[\s\S]*?<\/li>\n?)+/g,
          (match) => `<ul class="list-disc pl-6 mb-2">${match}</ul>`
        )
        // Replace leftover new lines with <br>, but avoid extra breaks after headings or lists
        .replace(/([^\n])\n([^\n])/g, "$1<br/>$2")
    );
  };

  useEffect(() => {
    if (activeTab === 2) fetchAIInsights();
  }, [activeTab]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions", err));

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/submissions/status-map/${userId}`
      )
      .then((res) => {
        const map = {};
        res.data.forEach((s) => {
          map[s.questionId] = s.status;
        });
        setStatusMap(map);
      })
      .catch((err) => console.error("Error fetching status map", err));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/user/${userId}`)
      .then((res) => {
        const updated = res.data.map((s) => ({
          ...s,
          runtime: calculateRuntime(s.code, s.language),
        }));
        setSubmissions(updated);
      })
      .catch((err) => console.error("Error fetching submissions", err));
  }, [userId]);

  const calculateRuntime = (code, lang) => {
    // Simulate runtime based on length of code + language multiplier
    let base = code.length;
    const multiplier = lang === "python" ? 0.6 : lang === "cpp" ? 0.3 : 0.5;
    return Math.round(base * multiplier * 0.1); // Fake runtime in ms
  };

  const getStatusMap = () => {
    const map = {};
    submissions.forEach((s) => (map[s.questionId] = s.status));
    return map;
  };

  const languageStats = submissions.reduce((acc, curr) => {
    acc[curr.language] = (acc[curr.language] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(languageStats).map(([lang, count]) => ({
    name: lang,
    value: count,
  }));
  const COLORS = [
    "#4ade80",
    "#f87171",
    "#60a5fa",
    "#fbbf24",
    "#a78bfa",
    "#38bdf8",
  ];

  const total = submissions.length;
  const success = submissions.filter((s) => s.status === "Success").length;
  const failed = submissions.filter((s) => s.status === "Failed").length;
  const avgRuntime = (
    submissions.reduce((sum, s) => sum + (s.runtime || 0), 0) / total
  ).toFixed(2);
  const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;
  const mostUsedLang = pieData.sort((a, b) => b.value - a.value)[0]?.name;

  return (
    <div className="bg-[#161A30] min-h-screen text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center">Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {Tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`px-6 py-2 rounded-2xl font-medium transition sm:text-sm sm:rounded-sm ${
              activeTab === idx
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Questions */}
      {activeTab === 0 && (
        <div className="space-y-6">
          {questions.map((q) => {
            const status = statusMap[q._id] || "Not Attempted";
            return (
              <div
                key={q._id}
                onClick={() => navigate(`/editor/${q._id}`)}
                className="w-full p-6 bg-[#1E1E2E] rounded-lg hover:shadow-lg hover:bg-[#2A2C4D] cursor-pointer transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-semibold">{q.title}</h2>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-gray-400">
                  {q.description?.length > 200
                    ? q.description.substring(0, 200) + "..."
                    : q.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Submissions */}
      {activeTab === 1 && (
        <>
          {/* Large screen table */}
          <div className="hidden md:block overflow-x-auto bg-[#1E1E2E] p-6 rounded-lg shadow-lg">
            {submissions.length === 0 ? (
              <div className="text-center text-gray-400 py-16 flex flex-col items-center justify-center space-y-4">
                {user ? (
                  <>
                    <FaFolderOpen className="text-6xl text-blue-500 animate-pulse" />
                    <p className="mb-2 text-xl font-semibold text-white">
                      No submissions found yet
                    </p>
                    <p className="max-w-md">
                      Start solving problems now to see your submissions here!
                      Your journey to coding mastery begins with a single step.
                    </p>
                  </>
                ) : (
                  <>
                    <FaLock className="text-6xl text-red-500 animate-pulse" />
                    <p className="mb-2 text-xl font-semibold text-white">
                      No submissions to display
                    </p>
                    <p className="max-w-md">
                      Please{" "}
                      <Link
                        to="/auth"
                        className="text-blue-400 underline hover:text-blue-600 transition"
                      >
                        log in
                      </Link>{" "}
                      to view your submissions or start coding.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#2A2C4D] text-white">
                    <th className="p-3">Question</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Runtime</th>
                    <th className="p-3">Language</th>
                    <th className="p-3">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-600 hover:bg-[#26294a]"
                    >
                      <td className="p-3">{s.questionTitle}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            statusColors[s.status]
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">{s.runtime ?? "N/A"} ms</td>
                      <td className="p-3 capitalize">{s.language}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setActiveCode(s.code);
                            setActiveLang(s.language);
                            setShowModal(true);
                          }}
                          className="text-blue-400 hover:underline"
                          title="View Code"
                        >
                          📄 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-6">
            {submissions.length === 0 ? (
              <div className="text-center text-gray-400 py-16 flex flex-col items-center justify-center space-y-4">
                {user ? (
                  <>
                    <FaFolderOpen className="text-6xl text-blue-500 animate-pulse" />
                    <p className="mb-2 text-xl font-semibold text-white">
                      No submissions found yet
                    </p>
                    <p className="max-w-xs px-4">
                      Start solving problems now to see your submissions here!
                      Your journey to coding mastery begins with a single step.
                    </p>
                  </>
                ) : (
                  <>
                    <FaLock className="text-6xl text-red-500 animate-pulse" />
                    <p className="mb-2 text-xl font-semibold text-white">
                      No submissions to display
                    </p>
                    <p className="max-w-xs px-4">
                      Please{" "}
                      <Link
                        to="/auth"
                        className="text-blue-400 underline hover:text-blue-600 transition"
                      >
                        log in
                      </Link>{" "}
                      to view your submissions or start coding.
                    </p>
                  </>
                )}
              </div>
            ) : (
              submissions.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#1E1E2E] p-5 rounded-lg shadow-lg hover:bg-[#26294a] transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">{s.questionTitle}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[s.status]
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    Runtime: {s.runtime ?? "N/A"} ms
                  </p>
                  <p className="text-xs text-gray-400 mb-4 capitalize">
                    Language: {s.language}
                  </p>
                  <button
                    onClick={() => {
                      setActiveCode(s.code);
                      setActiveLang(s.language);
                      setShowModal(true);
                    }}
                    className="text-blue-400 hover:underline text-sm"
                    title="View Code"
                  >
                    📄 View Code
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Tab 3: Stats & AI Insights */}
      {activeTab === 2 && (
        <div className="max-w-4xl mx-auto bg-[#1E1E2E] p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <BarChart3 size={28} /> My Coding Stats
          </h2>
          {total === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No submissions yet. Try solving some questions!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={20} /> <strong>Total:</strong> {total}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={20} /> <strong>Success:</strong> {success}
                </p>
                <p className="flex items-center gap-2">
                  <XCircle size={20} /> <strong>Failed:</strong> {failed}
                </p>
                <p className="flex items-center gap-2">
                  <Cpu size={20} /> <strong>Most Used Lang:</strong>{" "}
                  {mostUsedLang}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={20} /> <strong>Avg Runtime:</strong> {avgRuntime}{" "}
                  ms
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-8 bg-gradient-to-r from-[#1f2937] to-[#2a2c4d] p-6 rounded-xl shadow-xl border border-indigo-600">
            <h3 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
              🤖 AI Insights
            </h3>

            {aiLoading ? (
              <div className="text-center text-gray-400 animate-pulse">
                <p className="text-lg">Analyzing your code...</p>
                <div className="mt-2 w-12 h-12 mx-auto border-4 border-dashed border-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {aiProficiency && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#202440] p-6 rounded-lg border-l-4 border-green-500 shadow-md mb-2"
                  >
                    <div
                      className="text-sm text-gray-200 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatProficiency(aiProficiency),
                      }}
                    />
                  </motion.div>
                )}

                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#202440] p-4 rounded-lg border-l-4 border-yellow-400"
                  >
                    <p
                      className="text-sm text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatSuggestion(aiSuggestion),
                      }}
                    />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#1E1E2E] w-[90%] md:w-[60%] max-h-[80vh] p-6 rounded-xl shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              ❌
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Submitted Code ({activeLang})
            </h2>
            <div className="overflow-auto max-h-[60vh] rounded-lg">
              <SyntaxHighlighter
                language={activeLang}
                style={oneDark}
                wrapLines={true}
              >
                {activeCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
