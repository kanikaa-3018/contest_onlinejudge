import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Code, Sparkles } from "lucide-react";
import UpcomingContests from "./UpcomingContests";
import RecentSubmissions from "./RecentSubmissions";
import ContestHistoryLeaderboard from "./ContestHistoryLeaderboard";
import StatsDashboard from "./StatsDashboard";


export const Dashboard = () => {
  const userData= localStorage.getItem("user");

  return (
    <div
      className="container py-6 space-y-8 px-4"
      style={{ backgroundColor: "#161A30", color: "#E0E0E0" }}
    >
      <div className="bg-gradient-to-r from-[#1E1E2F] via-[#2E2E48] to-[#1E1E2F] rounded-2xl p-8 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Welcome to CodeArena
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          Your ultimate companion to improve your problem-solving and coding
          skills.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-[#14142B] p-4 rounded-lg shadow-sm border border-[#2A2A3B]">
            <Sparkles className="text-[#00D1FF] mb-2" />
            <h3 className="text-lg font-semibold text-white">
              Live Contest Tracker
            </h3>
            <p className="text-sm text-gray-400">
              Stay informed about upcoming and ongoing contests across
              platforms.
            </p>
          </div>
          <div className="bg-[#14142B] p-4 rounded-lg shadow-sm border border-[#2A2A3B]">
            <Sparkles className="text-[#FFC300] mb-2" />
            <h3 className="text-lg font-semibold text-white">
              Global Leaderboard
            </h3>
            <p className="text-sm text-gray-400">
              Compare your performance with coders worldwide in real-time.
            </p>
          </div>
          <div className="bg-[#14142B] p-4 rounded-lg shadow-sm border border-[#2A2A3B]">
            <Sparkles className="text-[#00FFA3] mb-2" />
            <h3 className="text-lg font-semibold text-white">
              Comprehensive Stats
            </h3>
            <p className="text-sm text-gray-400">
              Track submissions, problems solved, and progress over time.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#00FFC6]">
          Welcome back, User
        </h1>

        <p className="text-sm text-gray-400">
          Track your progress, join contests, and improve your coding skills
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsDashboard/>

        <UpcomingContests/>

        <RecentSubmissions/>
      </div>

      <ContestHistoryLeaderboard/>
    </div>
  );
};

export default Dashboard;
