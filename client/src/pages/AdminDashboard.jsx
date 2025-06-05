import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReferenceCodeModal from "../components/ReferenceCodeModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    constraints: "",
    code: "",
    testCases: [{ input: "", output: "" }],
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") navigate("/");
    else fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [...form.testCases, { input: "", output: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/questions/${editId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/questions`;
      const method = editId ? "put" : "post";
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      constraints: "",
      testCases: [{ input: "", output: "" }],
    });
    setEditId(null);
    setFormOpen(false);
  };

  const handleEdit = (q) => {
    setForm(q);
    setEditId(q._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const fetchReferenceCode = async (questionId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${questionId}/reference-code`);
      console.log(res.data.referenceCode[0].code)
      if (res.data && res.data.referenceCode) {
        // const selectedLanguage = "python"; 
        return res.data.referenceCode[0].code;
      }
    } catch (err) {
      console.error("Failed to fetch reference code:", err);
    }
    return null;
  };

  const generateExtraTestCases = async (questionId) => {
    try {
      const code = await fetchReferenceCode(questionId); 
      console.log(code)
      if (!code) {
        alert("No reference code found for selected language.");
        return;
      }
  
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-tests`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.data.success) {
        const generated = res.data.tests;
        setForm({
          ...form,
          testCases: [...form.testCases, ...generated],
        });
      } else {
        alert("Test case generation failed.");
      }
    } catch (err) {
      console.error("Error generating test cases:", err);
      alert("Error generating test cases.");
    }
  };
  
  

  return (
    <div className="p-6 bg-[#161A30] min-h-screen text-white relative overflow-hidden">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setEditId(null);
          resetForm();
          setFormOpen(true);
        }}
        className="fixed top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10"
      >
        <FaPlus /> <span className="hidden sm:inline">Add Question</span>
      </motion.button>

      {/* Hero Section */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-bold text-blue-400">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Manage coding challenges with ease and clarity
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {[
            "Create Custom Questions",
            "Edit Existing Challenges",
            "Manage Test Cases",
            "Track Quality",
          ].map((text, i) => (
            <motion.div
              key={i}
              className="relative w-[250px] p-4 rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-md text-white overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 opacity-20 animate-gradientBlur z-0" />
              <div className="relative z-10 text-center font-semibold text-lg">
                {text}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Questions Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="overflow-x-auto bg-[#1E1E2E] rounded-xl shadow-xl"
      >
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#2D2F4A] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Constraints</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Test Cases</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr
                key={q._id}
                className="border-t border-gray-700 even:bg-[#22243D] hover:bg-[#2A2C4D]"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{q.title}</td>

                <td className="px-6 py-4">
                  {q.constraints?.length > 50
                    ? `${q.constraints.substring(0, 50)}...`
                    : q.constraints}
                </td>
                <td>
                  <ReferenceCodeModal questionId={q._id} />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => generateExtraTestCases(q._id)}
                    className="text-green-500 hover:underline ml-4"
                  >
                    + Generate Test Cases
                  </button>
                </td>
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(q)}
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E2E] p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-semibold text-center mb-4">
                {editId ? "Edit Question" : "Add Question"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#31304D] text-white"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#31304D] text-white"
                  required
                />
                <textarea
                  name="constraints"
                  placeholder="Constraints"
                  value={form.constraints}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#31304D] text-white"
                />
                <h3 className="font-semibold">Test Cases</h3>
                {form.testCases.map((tc, i) => (
                  <div key={i} className="space-y-2">
                    <textarea
                      placeholder="Input"
                      className="w-full p-2 rounded bg-[#31304D] text-white"
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(i, "input", e.target.value)
                      }
                      required
                    />
                    <textarea
                      placeholder="Output"
                      className="w-full p-2 rounded bg-[#31304D] text-white"
                      value={tc.output}
                      onChange={(e) =>
                        handleTestCaseChange(i, "output", e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTestCase}
                  className="text-blue-400 hover:underline"
                >
                  + Add Test Case
                </button>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    {editId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
