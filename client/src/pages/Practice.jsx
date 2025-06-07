import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Tag, ExternalLink } from "lucide-react";

const TAGS = [
  "implementation",
  "greedy",
  "dp",
  "math",
  "brute force",
  "data structures",
  "constructive algorithms",
  "graphs",
  "sortings",
  "binary search",
  "dfs and similar",
  "trees",
  "two pointers",
  "Array",
  "Hash Table",
  "String",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Tree",
  "Depth-First Search",
  "Breadth-First Search",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const RATINGS = [
  800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
];

const PLATFORMS = ["All", "Codeforces", "LeetCode"];

const fetchCodeforcesProblems = async (tag, rating) => {
  const url = "https://codeforces.com/api/problemset.problems";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Codeforces problems");
  const data = await response.json();
  let problems = data.result.problems;
  if (tag) problems = problems.filter((p) => p.tags.includes(tag));
  if (rating && typeof rating === "number")
    problems = problems.filter((p) => p.rating === parseInt(rating));
  return problems;
};

const fetchLeetCodeProblems = async (difficulty) => {
  const response = await fetch(
    "https://alfa-leetcode-api.onrender.com/problems"
  );
  if (!response.ok) throw new Error("Failed to fetch LeetCode problems");
  const data = await response.json();
  let problems = data.problemsetQuestionList;
  if (difficulty)
    problems = problems.filter((p) => p.difficulty === difficulty);
  return problems;
};

const Practice = () => {
  const [platform, setPlatform] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "practiceProblems",
      platform,
      selectedTag,
      selectedRating,
      selectedDifficulty,
    ],
    queryFn: async () => {
      if (platform === "Codeforces") {
        return await fetchCodeforcesProblems(selectedTag, selectedRating);
      } else if (platform === "LeetCode") {
        return await fetchLeetCodeProblems(selectedDifficulty);
      } else {
        const [cf, lc] = await Promise.all([
          fetchCodeforcesProblems(selectedTag, selectedRating),
          fetchLeetCodeProblems(selectedDifficulty),
        ]);
        if (platform === "Codeforces") return cf;
        if (platform === "LeetCode") return lc;
        return [...cf, ...lc];
      }
    },
  });

  const isCF = (problem) => "contestId" in problem;

  return (
    <div className="p-6 bg-gradient-to-tr from-[#0f0f23] via-[#161A30] to-[#1f1f3b] min-h-screen text-[#F0ECE5]">
      <h2 className="text-3xl font-bold mb-6">Practice Problems</h2>

      {/* Filters */}
   
      <div className="flex flex-col gap-4 mb-8 sm:grid md:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
        {/* Platform */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl w-full"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Tag (both) */}
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl w-full"
        >
          <option value="">All Tags</option>
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        {/* Rating (only for CF) */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl w-full"
          disabled={platform === "LeetCode"}
        >
          <option value="">All Ratings</option>
          {RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>

        {/* Difficulty (only for LeetCode) */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl w-full"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="text-center text-gray-400 animate-pulse items-center mt-40 min-h-screen">
          <p className="text-lg">Loading Problems...</p>
          <div className="mt-2 w-12 h-12 mx-auto border-4 border-dashed border-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}
      {isError && (
        <div className="text-center text-red-400">Failed to load problems.</div>
      )}

      {/* Problem Cards */}
      {!isLoading && !isError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.slice(0, 50).map((problem, index) => (
            <Card
              key={index}
              className="bg-[#202040]/60 backdrop-blur-xl border border-[#323248] rounded-2xl shadow-xl hover:scale-[1.01] transition-all duration-200"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen size={20} />
                  {isCF(problem)
                    ? `${problem.contestId}${problem.index}: ${problem.name}`
                    : problem.title}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-[#B6BBC4]">
                  <Tag size={16} />
                  {isCF(problem)
                    ? problem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#31304D]/60 px-2 py-1 rounded-lg text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    : problem.topicTags?.map((tag) => (
                        <span
                          key={tag.name}
                          className="bg-[#31304D]/60 px-2 py-1 rounded-lg text-xs"
                        >
                          {tag.name}
                        </span>
                      ))}
                </div>

                <a
                  href={
                    isCF(problem)
                      ? `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
                      : `https://leetcode.com/problems/${problem.titleSlug}/`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-blue-300 hover:underline"
                >
                  <ExternalLink size={16} />
                  {isCF(problem) ? "View on Codeforces" : "View on LeetCode"}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Practice;
