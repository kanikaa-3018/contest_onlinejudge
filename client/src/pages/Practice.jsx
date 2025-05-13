import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Tag, ExternalLink } from 'lucide-react';

const TAGS = [
  'implementation', 'greedy', 'dp', 'math', 'brute force',
  'data structures', 'constructive algorithms', 'graphs',
  'sortings', 'binary search', 'dfs and similar', 'trees', 'two pointers',
];

const RATINGS = [
  800, 900, 1000, 1100, 1200, 1300, 1400,
  1500, 1600, 1700, 1800, 1900, 2000,
];

const PLATFORMS = ['All', 'Codeforces', 'LeetCode'];

// Fetch Codeforces problems with optional filters
const fetchCodeforcesProblems = async (tag, rating) => {
  const url = 'https://codeforces.com/api/problemset.problems';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Codeforces problems');
  const data = await response.json();
  let problems = data.result.problems;
  if (tag) problems = problems.filter(p => p.tags.includes(tag));
  if (rating) problems = problems.filter(p => p.rating === parseInt(rating));
  return problems;
};

// Fetch LeetCode problems through your proxy
const fetchLeetCodeProblems = async () => {
  const query = `
    query {
      problemsetQuestionList(limit: 50) {
        questions {
          title
          titleSlug
          difficulty
          topicTags {
            name
          }
        }
      }
    }
  `;
  const response = await fetch('http://localhost:8080/leetcode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error('Failed to fetch LeetCode problems');
  const result = await response.json();
  return result.data.problemsetQuestionList.questions;
};

const Practice = () => {
  const [platform, setPlatform] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['practiceProblems', platform, selectedTag, selectedRating],
    queryFn: async () => {
      if (platform === 'Codeforces') {
        return await fetchCodeforcesProblems(selectedTag, selectedRating);
      } else if (platform === 'LeetCode') {
        return await fetchLeetCodeProblems();
      } else {
        const [cf, lc] = await Promise.all([
          fetchCodeforcesProblems(selectedTag, selectedRating),
          fetchLeetCodeProblems(),
        ]);
        return [...cf, ...lc];
      }
    },
  });

  const isCF = (problem) => 'contestId' in problem;

  return (
    <div className="p-6 bg-gradient-to-tr from-[#0f0f23] via-[#161A30] to-[#1f1f3b] min-h-screen text-[#F0ECE5]">
      <h2 className="text-3xl font-bold mb-6">Practice Problems</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        {/* Platform */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl min-w-[150px]"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Tag (only for CF) */}
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl min-w-[150px]"
          disabled={platform === 'LeetCode'}
        >
          <option value="">All Tags</option>
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Rating (only for CF) */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="bg-[#1F1D36] text-white p-3 rounded-xl min-w-[150px]"
          disabled={platform === 'LeetCode'}
        >
          <option value="">All Ratings</option>
          {RATINGS.map((rating) => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      {/* Loading / Error */}
      {isLoading && <div className="text-center">Loading problems...</div>}
      {isError && <div className="text-center text-red-400">Failed to load problems.</div>}

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
                        <span key={tag} className="bg-[#31304D]/60 px-2 py-1 rounded-lg text-xs">
                          {tag}
                        </span>
                      ))
                    : problem.topicTags?.map((tag) => (
                        <span key={tag.name} className="bg-[#31304D]/60 px-2 py-1 rounded-lg text-xs">
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
                  {isCF(problem) ? 'View on Codeforces' : 'View on LeetCode'}
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
