import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    constraints: "",
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
      const res = await axios.get("http://localhost:8080/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...form.testCases];
    updatedTestCases[index][field] = value;
    setForm({ ...form, testCases: updatedTestCases });
  };

  const addTestCase = () => {
    setForm({ ...form, testCases: [...form.testCases, { input: "", output: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId
        ? `http://localhost:8080/api/questions/${editId}`
        : `http://localhost:8080/api/questions`;
      const method = editId ? "put" : "post";
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        title: "",
        description: "",
        constraints: "",
        testCases: [{ input: "", output: "" }],
      });
      setEditId(null);
      setFormOpen(false);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const handleEdit = (question) => {
    setForm(question);
    setEditId(question._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-[#161A30] min-h-screen text-white relative">
      {/* Add Button (fixed top right) */}
      <button
        onClick={() => {
          setEditId(null);
          setForm({
            title: "",
            description: "",
            constraints: "",
            testCases: [{ input: "", output: "" }],
          });
          setFormOpen(true);
        }}
        className="fixed top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10"
      >
        <FaPlus /> <span className="hidden sm:inline">Add Question</span>
      </button>

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage coding questions and test cases efficiently</p>
      </div>

      {/* Question Table */}
      <div className="overflow-x-auto bg-[#1E1E2E] rounded-xl shadow-xl">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#2D2F4A] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Constraints</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={q._id} className="border-t border-gray-700 even:bg-[#22243D] hover:bg-[#2A2C4D]">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{q.title}</td>
                <td className="px-6 py-4">
                  {q.constraints?.length > 50 ? `${q.constraints.substring(0, 50)}...` : q.constraints}
                </td>
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button onClick={() => handleEdit(q)} className="text-yellow-400 hover:text-yellow-300 transition">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-red-400 transition">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2E] p-6 rounded-xl max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="text-2xl font-semibold text-center">
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
                  <input
                    type="text"
                    placeholder="Input"
                    className="w-full p-2 rounded bg-[#31304D] text-white"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(i, "input", e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    className="w-full p-2 rounded bg-[#31304D] text-white"
                    value={tc.output}
                    onChange={(e) => handleTestCaseChange(i, "output", e.target.value)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
