import React from "react";

const Learn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#161A30] via-[#1E1E2E] to-[#31304D] text-[#F0ECE5] p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📚 Learn DSA</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1E1E2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Striver's SDE Sheet</h3>
          <p className="text-gray-300 mb-4">
            The most comprehensive SDE sheet for cracking the coding interviews, curated by Striver. This sheet covers over 180 problems and various topics, including Arrays, Trees, DP, etc.
          </p>
          <a
            href="https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            🔗 Check the full sheet here
          </a>
        </div>

        <div className="bg-[#1E1E2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">NeetCode 150</h3>
          <p className="text-gray-300 mb-4">
            NeetCode’s list of 150 essential LeetCode problems that are a must for interview preparation. Each problem is carefully selected for the most common interview topics.
          </p>
          <a
            href="https://neetcode.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            🔗 Check the full sheet here
          </a>
        </div>

        <div className="bg-[#1E1E2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Love Babbar 450 Sheet</h3>
          <p className="text-gray-300 mb-4">
            This 450-question sheet is one of the most popular for DSA preparation, covering all major topics. It includes links to detailed explanations and solutions.
          </p>
          <a
            href="https://github.com/loveBabbar/450-DSA-Questions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            🔗 Check the full sheet here
          </a>
        </div>

        <div className="bg-[#1E1E2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Fraz 75 Sheet</h3>
          <p className="text-gray-300 mb-4">
            Fraz’s 75 problems, selected from top coding platforms like LeetCode, are recommended for building problem-solving skills and excelling in interviews.
          </p>
          <a
            href="https://takeuforward.org/interviews/frazs-striver-sde-sheet-top-coding-interview-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            🔗 Check the full sheet here
          </a>
        </div>

        <div className="bg-[#1E1E2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Apna College DSA Sheet</h3>
          <p className="text-gray-300 mb-4">
            A well-structured DSA sheet curated by Apna College (Aman Dhattarwal), including multiple categories of questions and video explanations for beginners.
          </p>
          <a
            href="https://docs.google.com/spreadsheets/d/1whn5W1je3a8AwLdybCYrFzVzLqFJjPtT/edit#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            🔗 Check the full sheet here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Learn;
