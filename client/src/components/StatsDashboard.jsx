import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Award,
  Calendar,
  TrendingUp,
  CheckCircle,
  BarChart2,
} from "react-feather";

const StatsDashboard = () => {
  const handle = localStorage.getItem("cfHandle");

  const [stats, setStats] = useState({
    solved: 0,
    total: 800,
    rating: "Unrated",
    maxRating: "Unrated",
    rank: "Unrated",
    bestRank: "Unrated",
    contests: 0,
    lastContestDate: "N/A",
    streak: "N/A",
    solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, submissionsRes, contestsRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
        ]);

        const user = userRes.data.result[0];
        const submissions = submissionsRes.data.result;
        const contests = contestsRes.data.result;

        // Track solved problems uniquely
        const solvedSet = new Set();
        // Track solved by difficulty - dummy approach: use problem.rating or tags if available
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };

        // Track streak days
        const streakDays = new Set();

        submissions.forEach((sub) => {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedSet.add(key);

            // Approximate difficulty by problem rating (if available)
            const rating = sub.problem.rating;
            if (rating) {
              if (rating < 1400) difficultyCount.easy += 1;
              else if (rating < 2000) difficultyCount.medium += 1;
              else difficultyCount.hard += 1;
            }

            const date = new Date(sub.creationTimeSeconds * 1000).toDateString();
            streakDays.add(date);
          }
        });

        // Calculate streak - count unique days in the last 7 days (approximate)
        const streak = `${Math.min(streakDays.size, 7)} days`;

        // Calculate best rank from contests data
        let bestRank = "N/A";
        let lastContestDate = "N/A";

        if (contests.length > 0) {
          const ranks = contests.map((c) => c.rank).filter((r) => r !== undefined);
          bestRank = ranks.length > 0 ? Math.min(...ranks) : "N/A";

          const lastContest = contests.reduce((latest, c) =>
            c.ratingUpdateTimeSeconds > (latest?.ratingUpdateTimeSeconds || 0) ? c : latest,
            null
          );

          if (lastContest) {
            lastContestDate = new Date(lastContest.ratingUpdateTimeSeconds * 1000).toLocaleDateString();
          }
        }

        setStats({
          solved: solvedSet.size,
          total: 800,
          rating: user.rating || "Unrated",
          maxRating: user.maxRating || "Unrated",
          rank: user.rank || "Unrated",
          bestRank,
          contests: contests.length,
          lastContestDate,
          streak,
          solvedByDifficulty: difficultyCount,
        });
      } catch (err) {
        console.error("Error fetching Codeforces stats:", err);
      }
    };

    if (handle) fetchStats();
  }, [handle]);

  const progress = Math.min((stats.solved / stats.total) * 100, 100);

  return (
    <Card className="bg-[#14142B] text-white border border-[#2A2A3B] w-full">
  <CardHeader>
    <CardTitle className="text-xl sm:text-2xl">Your Stats</CardTitle>
    <CardDescription className="text-gray-400 text-sm sm:text-base">
      Your coding journey so far
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6 min-h-[400px] px-4 sm:px-6">
    {/* Problems Solved with progress */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Problems Solved</span>
        <span className="text-sm font-medium text-[#00FFC6]">
          {stats.solved}/{stats.total}
        </span>
      </div>
      <Progress value={progress} className="bg-gray-700 h-2" />
    </div>

    {/* Main stats grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      <StatItem icon={<TrendingUp size={20} />} label="Current Rating" value={stats.rating} />
      <StatItem icon={<Star size={20} />} label="Max Rating" value={stats.maxRating} />
      <StatItem icon={<Award size={20} />} label="Rank" value={capitalize(stats.rank)} />
      <StatItem icon={<Award size={20} />} label="Best Rank" value={stats.bestRank} />
      <StatItem icon={<Calendar size={20} />} label="Contests" value={stats.contests} />
      <StatItem icon={<Calendar size={20} />} label="Last Contest" value={stats.lastContestDate} />
    </div>

    {/* Problems solved by difficulty */}
    <div>
      <h3 className="text-[#00FFC6] font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
        <BarChart2 size={20} /> Solved Problems by Difficulty
      </h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
        <DifficultyBadge label="Easy" value={stats.solvedByDifficulty.easy} color="green" />
        <DifficultyBadge label="Medium" value={stats.solvedByDifficulty.medium} color="yellow" />
        <DifficultyBadge label="Hard" value={stats.solvedByDifficulty.hard} color="red" />
      </div>
    </div>
  </CardContent>

  <CardFooter>
    <Button
      variant="outline"
      className="border-[#00FFC6] text-[#00FFC6] w-full sm:w-auto"
      onClick={() => (window.location.href = "/profile")}
    >
      View Full Profile
    </Button>
  </CardFooter>
</Card>

  );
};

// Helper component for each stat item
const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-[#1e1e3a] rounded-md p-3 shadow-sm">
    <div className="text-[#00FFC6]">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-md font-bold">{value}</p>
    </div>
  </div>
);

// Helper component for difficulty badges
const DifficultyBadge = ({ label, value, color }) => {
  const colors = {
    green: "bg-green-600 text-green-300",
    yellow: "bg-yellow-600 text-yellow-300",
    red: "bg-red-600 text-red-300",
  };
  return (
    <div
      className={`px-3 py-1 rounded-md font-semibold ${colors[color]} bg-opacity-30`}
    >
      {label}: {value}
    </div>
  );
};

// Capitalize first letter helper
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default StatsDashboard;
