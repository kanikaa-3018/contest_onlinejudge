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

const StatsDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const handle = localStorage.getItem("cfHandle")

  const [stats, setStats] = useState({
    solved: 0,
    total: 800,
    rating: 0,
    rank: "Unrated",
    contests: 0,
    streak: "N/A",
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

        const solvedSet = new Set();
        const streakDays = new Set();

        submissions.forEach((sub) => {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedSet.add(key);

            const date = new Date(sub.creationTimeSeconds * 1000).toDateString();
            streakDays.add(date);
          }
        });

        const streak = `${Math.min(streakDays.size, 7)} days`;

        setStats({
          solved: solvedSet.size,
          total: 800,
          rating: user.rating || "Unrated",
          rank: user.rank || "Unrated",
          contests: contests.length,
          streak,
        });
      } catch (err) {
        console.error("Error fetching Codeforces stats:", err);
      }
    };

    fetchStats();
  }, [handle]);

  const progress = Math.min((stats.solved / stats.total) * 100, 100);

  return (
    <Card className="bg-[#14142B] text-white border border-[#2A2A3B]">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
        <CardDescription className="text-gray-400">
          Your coding journey so far
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Problems Solved</span>
            <span className="text-sm font-medium text-[#00FFC6]">
              {stats.solved}/{stats.total}
            </span>
          </div>
          <Progress value={progress} className="bg-gray-700" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Rating", value: stats.rating },
            { label: "Rank", value: stats.rank },
            { label: "Contests", value: stats.contests },
            { label: "Streak", value: stats.streak },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-2xl font-bold text-[#00FFC6]">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="border-[#00FFC6] text-[#00FFC6]"
          onClick={() => window.location.href = "/profile"}
        >
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatsDashboard;
