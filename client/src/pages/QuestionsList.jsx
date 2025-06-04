import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Code2, CheckCircle2, XCircle, Clock, Cpu, BarChart3 } from "lucide-react";
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
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    axios.get("http://localhost:8080/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions", err));

    axios.get(`http://localhost:8080/api/submissions/status-map/${userId}`)
      .then((res) => {
        const map = {};
        res.data.forEach((s) => {
          map[s.questionId] = s.status;
        });
        setStatusMap(map);
      })
      .catch((err) => console.error("Error fetching status map", err));

    axios.get(`http://localhost:8080/api/submissions/user/${userId}`)
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

  const pieData = Object.entries(languageStats).map(([lang, count]) => ({ name: lang, value: count }));
  const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#38bdf8"];

  const total = submissions.length;
  const success = submissions.filter((s) => s.status === "Success").length;
  const failed = submissions.filter((s) => s.status === "Failed").length;
  const avgRuntime = (submissions.reduce((sum, s) => sum + (s.runtime || 0), 0) / total).toFixed(2);
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
            className={`px-6 py-2 rounded-full font-medium transition ${
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
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
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
        <div className="overflow-x-auto bg-[#1E1E2E] p-4 rounded-lg">
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
                <tr key={i} className="border-t border-gray-600 hover:bg-[#26294a]">
                  <td className="p-3">{s.questionTitle}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
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
        </div>
      )}

      {/* Tab 3: Placeholder */}
      {activeTab === 2 && (
        <div className="max-w-4xl mx-auto bg-[#1E1E2E] p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <BarChart3 size={28} /> My Coding Stats
          </h2>
          {total === 0 ? (
            <p className="text-center text-gray-400">No submissions yet. Try solving some questions!</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-300">
                <p className="flex items-center gap-2"><CheckCircle2 size={20} /> <strong>Total:</strong> {total}</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={20} /> <strong>Success:</strong> {success}</p>
                <p className="flex items-center gap-2"><XCircle size={20} /> <strong>Failed:</strong> {failed}</p>
                <p className="flex items-center gap-2"><Cpu size={20} /> <strong>Most Used Lang:</strong> {mostUsedLang}</p>
                <p className="flex items-center gap-2"><Clock size={20} /> <strong>Avg Runtime:</strong> {avgRuntime} ms</p>
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
              <SyntaxHighlighter language={activeLang} style={oneDark} wrapLines={true}>
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
