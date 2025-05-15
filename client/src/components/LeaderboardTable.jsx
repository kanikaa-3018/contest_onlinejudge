import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function for CodeForces rating colors
function getRatingColor(rating) {
  if (rating < 1200) return 'text-gray-400'; // Newbie
  if (rating < 1400) return 'text-green-500'; // Pupil
  if (rating < 1600) return 'text-[#03a89e]'; // Specialist
  if (rating < 1900) return 'text-blue-500'; // Expert
  if (rating < 2100) return 'text-purple-500'; // Candidate Master
  if (rating < 2400) return 'text-[#ff8c00]'; // Master
  return 'text-red-500'; // Grandmaster+
}

const LeaderboardTable = ({ users, setSelectedUser }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#403E43]">
            <th className="text-left py-4 px-3 text-gray-400">Rank</th>
            <th className="text-left py-4 px-3 text-gray-400">User</th>
            <th className="text-left py-4 px-3 text-gray-400 hidden md:table-cell">LeetCode</th>
            <th className="text-left py-4 px-3 text-gray-400 hidden md:table-cell">CodeForces</th>
            <th className="text-right py-4 px-3 text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[#403E43] hover:bg-[#2d2a33]">
              <td className="py-4 px-3">
                <div className="flex items-center">
                  {user.rank === 1 ? (
                    <Trophy className="text-[#f6e58d] mr-2" size={18} />
                  ) : (
                    <span className="text-lg font-bold">{user.rank}</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-3">
                <div className="flex items-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#403E43] mr-3"></div>
                  )}
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-3 hidden md:table-cell">
                <div>
                  <div className="text-[#33C3F0]">{user.leetcode.contestRating}</div>
                  <div className="text-sm text-gray-400">{user.leetcode.totalSolved} problems</div>
                </div>
              </td>
              <td className="py-4 px-3 hidden md:table-cell">
                <div>
                  <div className={getRatingColor(user.codeforces.rating)}>
                    {user.codeforces.rating}
                  </div>
                  <div className="text-sm text-gray-400">{user.codeforces.rank}</div>
                </div>
              </td>
              <td className="py-4 px-3 text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[#8B5CF6] hover:text-white hover:bg-[#8B5CF6]"
                  onClick={() => setSelectedUser(user)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;