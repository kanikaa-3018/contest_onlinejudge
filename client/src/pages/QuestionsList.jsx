import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-[#161A30] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Practice Questions</h1>
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q._id}
            onClick={() => navigate(`/editor/${q._id}`)}
            className="p-4 bg-[#1E1E2E] rounded shadow hover:bg-[#2A2C4D] cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{q.title}</h2>
            <p className="text-gray-400">{q.constraints?.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
