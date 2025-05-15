import React from 'react';

const ContestHistory = ({ cfcontests = [], lccontests = [] }) => {
  // Ensure the data is always treated as an array
  const codeforcesContests = Array.isArray(cfcontests) ? cfcontests : [];
  const leetcodeContests = Array.isArray(lccontests) ? lccontests : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Codeforces Contests</h3>
        {codeforcesContests.length > 0 ? (
          codeforcesContests.map((contest, index) => (
            <div key={index} className="bg-[#1A1F2C] p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{contest.name}</span>
                <span className="text-sm text-gray-400">{contest.date}</span>
              </div>
              <div className="flex justify-between mt-2">
                <div>
                  <span className="text-sm text-gray-400">Rank</span>
                  <div className="text-lg font-medium">{contest.rank}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Solved</span>
                  <div className="text-lg font-medium">{contest.solved}/{contest.totalProblems}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No Codeforces contest history available.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">LeetCode Contests</h3>
        {leetcodeContests.length > 0 ? (
          leetcodeContests.map((contest, index) => (
            <div key={index} className="bg-[#1A1F2C] p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{contest.name}</span>
                <span className="text-sm text-gray-400">{contest.date}</span>
              </div>
              <div className="flex justify-between mt-2">
                <div>
                  <span className="text-sm text-gray-400">Rank</span>
                  <div className="text-lg font-medium">{contest.rank}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Solved</span>
                  <div className="text-lg font-medium">{contest.solved}/{contest.totalProblems}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No LeetCode contest history available.</p>
        )}
      </div>
    </div>
  );
};

export default ContestHistory;
