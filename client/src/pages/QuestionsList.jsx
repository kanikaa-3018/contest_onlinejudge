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
  const [submissions, setSubmissions] = useState({}); 
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId= user._id;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));

    const fetchSubmissionStatuses = async () => {
      try {
        const res = await axios.get(
         `http://localhost:8080/api/submissions/user/${userId}`
        );
        // console.log(res)
        const statusMap = {};
        res.data.forEach((submission) => {
          statusMap[submission.questionId] = submission.status;
        });
  
        setSubmissions(statusMap);
      } catch (err) {
        console.error("Error fetching submissions", err);
      }
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
