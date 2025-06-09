import React, { useState } from "react";

const ContestHistory = ({ cfcontests = [], lcContests = [] }) => {
  const [cfVisible, setCfVisible] = useState(3);
  const [lcVisible, setLcVisible] = useState(3);

  
  const handleShowMoreCF = () => {
    setCfVisible((prev) => prev + 3);
  };

  
  const handleShowMoreLC = () => {
    setLcVisible((prev) => prev + 3);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Codeforces Contests</h3>
        {cfcontests.length > 0 ? (
          <>
            {cfcontests.slice(0, cfVisible).map((contest, index) => (
              <div key={index} className="bg-[#1A1F2C] p-3 rounded-lg mb-2">
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
                    <div className="text-lg font-medium">
                      {contest.solved}/{contest.totalProblems}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cfVisible < cfcontests.length && (
              <button
                onClick={handleShowMoreCF}
                className="text-blue-500 hover:underline"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-400">No Codeforces contest history available.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">LeetCode Contests</h3>
        {lcContests && lcContests.length > 0 ? (
          <>
            {lcContests.slice(0, lcVisible).map((contest, index) => (
              <div key={index} className="bg-[#1A1F2C] p-3 rounded-lg mb-2">
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
                    <div className="text-lg font-medium">
                      {contest.solved}/{contest.totalProblems}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {lcVisible < lcContests.length && (
              <button
                onClick={handleShowMoreLC}
                className="text-blue-500 hover:underline"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-400">LeetCode contest history not available.</p>
        )}
      </div>
    </div>
  );
};

export default ContestHistory;
