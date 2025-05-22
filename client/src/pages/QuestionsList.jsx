import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusColors = {
  Success: "bg-green-600 text-green-100",
  Failed: "bg-red-600 text-red-100",
  "Not Attempted": "bg-gray-600 text-gray-300",
};

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState({}); // Example: { 'questionId': 'Success' }
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));

    // Simulate fetching submission statuses for current user
    const fetchSubmissionStatuses = async () => {
      setSubmissions({
        "64fcd9e7b2f3a71234567890": "Success",
        "64fcd9e7b2f3a71234567891": "Failed",
        "64fcd9e7b2f3a71234567892": "Not Attempted",
      });
    };

    fetchSubmissionStatuses();
  }, []);

  return (
    <div className="p-6 bg-[#161A30] min-h-screen text-white mx-auto w-full">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
        Practice Questions
      </h1>

      <div className="space-y-6">
        {questions.map((q) => {
          const status = submissions[q._id] || "Not Attempted";
          return (
            <div
              key={q._id}
              onClick={() => navigate(`/editor/${q._id}`)}
              className="w-full p-6 bg-[#1E1E2E] rounded-lg shadow-md hover:shadow-xl hover:bg-[#2A2C4D] cursor-pointer transition duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold tracking-wide">{q.title}</h2>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}
                >
                  {status}
                </span>
              </div>

              <p className="text-gray-400 text-base leading-relaxed">
                {q.description?.length > 200
                  ? q.description.substring(0, 200) + "..."
                  : q.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsList;
