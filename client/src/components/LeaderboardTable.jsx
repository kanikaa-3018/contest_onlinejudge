import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Helper function for CodeForces rating colors - now theme aware
function getRatingColor(rating) {
  if (rating < 1200) return 'text-muted-foreground'; // Newbie
  if (rating < 1400) return 'text-green-600 dark:text-green-400'; // Pupil  
  if (rating < 1600) return 'text-cyan-600 dark:text-cyan-400'; // Specialist
  if (rating < 1900) return 'text-blue-600 dark:text-blue-400'; // Expert
  if (rating < 2100) return 'text-purple-600 dark:text-purple-400'; // Candidate Master
  if (rating < 2400) return 'text-orange-600 dark:text-orange-400'; // Master
  return 'text-red-600 dark:text-red-400'; // Grandmaster+
}

const LeaderboardTable = () => {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState(5);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/global-leaderboard`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        const formattedUsers = data.slice(0, 100).map((user, index) => ({
          id: index + 1,
          rank: index + 1,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          username: user.handle,
          rating: user.rating,
          avatar: user.avatar || "https://userpic.codeforces.org/no-avatar.png",
          rankTitle: user.rank,
          country: user.country || "N/A",
          organization: user.organization || "N/A",
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching global leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  const loadMore = () => {
    setVisibleUsers((prev) => prev + 10);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-3 text-muted-foreground">Rank</th>
            <th className="text-left py-4 px-3 text-muted-foreground">User</th>
            <th className="text-left py-4 px-3 text-muted-foreground">Rating</th>
            <th className="text-left py-4 px-3 text-muted-foreground">Country</th>
            <th className="text-left py-4 px-3 text-muted-foreground">Organization</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, visibleUsers).map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-accent">
              <td className="py-4 px-3">
                <div className="flex items-center">
                  {user.rank === 1 ? (
                    <Trophy className="text-yellow-500 mr-2" size={18} />
                  ) : (
                    <span className="text-lg font-bold text-foreground">{user.rank}</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-3">
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-3">
                <span className={getRatingColor(user.rating)}>{user.rating}</span>
                <div className="text-sm text-muted-foreground">{user.rankTitle}</div>
              </td>
              <td className="py-4 px-3 text-foreground">{user.country}</td>
              <td className="py-4 px-3 text-foreground">{user.organization}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleUsers < users.length && (
        <div className="text-center mt-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary-foreground hover:bg-primary"
            onClick={loadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
