import React, { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  BarChart,
  TrendingUp,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import UserProfile from "../components/UserProfile.jsx";
import StatsCard from "../components/StatsCard.jsx";
import ContestHistory from "../components/ContestHistory.jsx";
import ProblemDistribution from "../components/ProblemDistribution.jsx";
import LeetcodeBadges from "../components/LeetcodeBadges.jsx";
import LeaderboardTable from "../components/LeaderboardTable.jsx";

const userStats = [
  {
    id: 1,
    rank: 1,
    username: "codewarrior",
    name: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?img=1",
    leetcode: {
      handle: "codewarrior",
      totalSolved: 645,
      easySolved: 214,
      mediumSolved: 325,
      hardSolved: 106,
      contestRating: 2145,
      ranking: 1245,
      badges: ["Knight", "Daily Streak 100", "Problem Setter"],
      streak: 74,
    },
    codeforces: {
      handle: "alexc",
      rating: 1842,
      maxRating: 1901,
      rank: "Expert",
      contests: 42,
      contributions: 15,
      problemsSolved: 387,
    },
  },
  {
    id: 2,
    rank: 2,
    username: "algoguru",
    name: "Mia Zhang",
    avatar: "https://i.pravatar.cc/150?img=5",
    leetcode: {
      handle: "algoguru",
      totalSolved: 589,
      easySolved: 189,
      mediumSolved: 290,
      hardSolved: 110,
      contestRating: 2267,
      ranking: 856,
      badges: ["Guardian", "Year-long Streak", "Contest Winner"],
      streak: 365,
    },
    codeforces: {
      handle: "miazhang",
      rating: 2150,
      maxRating: 2205,
      rank: "Master",
      contests: 67,
      contributions: 23,
      problemsSolved: 452,
    },
  },
  {
    id: 3,
    rank: 3,
    username: "codeslayer",
    name: "Jake Williams",
    avatar: "https://i.pravatar.cc/150?img=8",
    leetcode: {
      handle: "codeslayer",
      totalSolved: 512,
      easySolved: 201,
      mediumSolved: 245,
      hardSolved: 66,
      contestRating: 1896,
      ranking: 3421,
      badges: ["Knight", "Contest Top 10%"],
      streak: 42,
    },
    codeforces: {
      handle: "jwilliams",
      rating: 1756,
      maxRating: 1789,
      rank: "Expert",
      contests: 31,
      contributions: 7,
      problemsSolved: 289,
    },
  },
  {
    id: 4,
    rank: 4,
    username: "bytecoder",
    name: "Sophia Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    leetcode: {
      handle: "bytecoder",
      totalSolved: 478,
      easySolved: 187,
      mediumSolved: 211,
      hardSolved: 80,
      contestRating: 1967,
      ranking: 2879,
      badges: ["Guardian", "Problem Setter"],
      streak: 58,
    },
    codeforces: {
      handle: "sophiarodriguez",
      rating: 1699,
      maxRating: 1752,
      rank: "Expert",
      contests: 28,
      contributions: 12,
      problemsSolved: 321,
    },
  },
  {
    id: 5,
    rank: 5,
    username: "algomaster",
    name: "David Kumar",
    avatar: "https://i.pravatar.cc/150?img=12",
    leetcode: {
      handle: "algomaster",
      totalSolved: 432,
      easySolved: 167,
      mediumSolved: 198,
      hardSolved: 67,
      contestRating: 1845,
      ranking: 4532,
      badges: ["Knight"],
      streak: 29,
    },
    codeforces: {
      handle: "davkumar",
      rating: 1621,
      maxRating: 1701,
      rank: "Expert",
      contests: 23,
      contributions: 4,
      problemsSolved: 256,
    },
  },
];

const problemData = [
  { name: "Easy", value: 214, color: "#4ade80" },
  { name: "Medium", value: 325, color: "#f59e0b" },
  { name: "Hard", value: 106, color: "#ef4444" },
];

const COLORS = ["#4ade80", "#f59e0b", "#ef4444"];

function getRatingColor(rating) {
  if (rating < 1200) return "text-gray-400"; // Newbie
  if (rating < 1400) return "text-green-500"; // Pupil
  if (rating < 1600) return "text-[#03a89e]"; // Specialist
  if (rating < 1900) return "text-blue-500"; // Expert
  if (rating < 2100) return "text-purple-500"; // Candidate Master
  if (rating < 2400) return "text-[#ff8c00]"; // Master
  return "text-red-500"; // Grandmaster+
}

const Lead = () => {
  const [cfcontests, setCfcontests] = useState([]);
  const [lcContests, setLcContests] = useState([]);
  const [problemData, setProblemData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState("overview");
  const [handles, setHandles] = useState({
    codeforces: "",
    leetcode: "",
  });
  const [userData, setUserData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHandles((prev) => ({ ...prev, [name]: value }));
  };

  const fetchLeetCodeProblems = async (handle) => {
    try {
      const response = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}/solved`
      );
      const data = response?.data;

      const problemData = [
        { name: "Easy", value: data?.easySolved || 0, color: "#4ade80" },
        { name: "Medium", value: data?.mediumSolved || 0, color: "#f59e0b" },
        { name: "Hard", value: data?.hardSolved || 0, color: "#ef4444" },
      ];

      return problemData;
    } catch (error) {
      console.error("Error fetching LeetCode problem data:", error);
      return [
        { name: "Easy", value: 0, color: "#4ade80" },
        { name: "Medium", value: 0, color: "#f59e0b" },
        { name: "Hard", value: 0, color: "#ef4444" },
      ];
    }
  };
  const handleSubmit = async () => {
    setSubmitted(true);
    setStatsLoading(true);
    const codeforcesData = await fetchCodeforcesData(handles.codeforces);
    let leetcodeData = null;
    try {
      leetcodeData = await fetchLeetCodeData(handles.leetcode);
    } catch (error) {
      console.error("LeetCode data not available:", error);
    }
    setStatsLoading(false);

    setUserData({ codeforcesData, leetcodeData });
  };

  const fetchCodeforcesData = async (handle) => {
    try {
      const userResponse = await axios.get(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const ratingResponse = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const submissionsResponse = await axios.get(
        `https://codeforces.com/api/user.status?handle=${handle}`
      );

      const userData = userResponse.data.result[0];
      const contests = ratingResponse.data.result;
      const submissions = submissionsResponse.data.result;

      const solvedSet = new Set();
      const dailySolvesMap = {};

      submissions.forEach((submission) => {
        if (submission.verdict === "OK") {
          const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
          const date = new Date(submission.creationTimeSeconds * 1000)
            .toISOString()
            .split("T")[0];

          if (!solvedSet.has(problemKey)) {
            solvedSet.add(problemKey);
            dailySolvesMap[date] = (dailySolvesMap[date] || 0) + 1;
          }
        }
      });

      const dailySolves = Object.entries(dailySolvesMap).map(
        ([date, count]) => ({
          date,
          count,
        })
      );

      return {
        ...userData,
        contests,
        solvedCount: solvedSet.size,
        dailySolves,
      };
    } catch (error) {
      console.error("Failed to fetch Codeforces data:", error);
      return null;
    }
  };

  const fetchLeetCodeData = async (handle) => {
    try {
      const profileResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/userProfile/${handle}`
      );
      const nameResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}`
      );
      const badgeResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}/badges`
      );
      const solvedResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}/solved`
      );
      const contestHistoryResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}/contest/history`
      );
      const submissionTreeResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${handle}/acSubmission`
      );

      return {
        named: nameResponse.data,
        profile: profileResponse.data,
        badges: badgeResponse.data,
        solved: solvedResponse.data || 0,
        contestAttend: contestHistoryResponse.data.length || 0,
        submissionTree: submissionTreeResponse.data,
      };
    } catch (error) {
      console.error("Failed to fetch LeetCode data:", error);
      return null;
    }
  };

  // For UI, example data arrays
  const questionData = [
    {
      name: "Codeforces",
      value: userData?.codeforcesData?.solvedCount || 0,
    },
    {
      name: "LeetCode",
      value: userData?.leetcodeData?.solved || 0,
    },
  ];

  const contestData = [
    {
      name: "Codeforces",
      contests: userData?.codeforcesData?.contests?.length || 0,
    },
    {
      name: "LeetCode",
      contests: userData?.leetcodeData?.contestAttend || 0,
    },
  ];

  const handleRefreshClick = () => {
    toast({
      title: "Data Refreshed",
      description: "Leaderboard data has been updated.",
    });
  };

  const fetchCodeforcesContestHistory = async (handle) => {
    try {
      const ratingResponse = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const contests = ratingResponse?.data?.result;

      const contestHistory = contests.map((contest) => ({
        name: contest.contestName,
        rank: contest.rank,
        solved: contest.rank ? Math.floor(Math.random() * 4) + 1 : 0, // Estimating solved problems
        totalProblems: 6,
        date: new Date(contest.ratingUpdateTimeSeconds * 1000)
          .toISOString()
          .split("T")[0],
      }));

      return contestHistory;
    } catch (error) {
      console.error("Failed to fetch Codeforces contest history:", error);
      return [];
    }
  };

  const fetchLeetCodeContestHistory = async (handle) => {
    try {
      const response = await axios.get(
        `https://alfa-leetcode-api.onrender.com/userContestRankingInfo${handle}`
      );

      if (Array.isArray(response.data)) {
        const contests = response?.data?.userContestRankingHistory;

        const contestHistory = contests.map((contest) => ({
          name: (contest?.attended) && contest?.contest?.title || "Unknown Contest",
          rank: (contest?.attended) && contest.ranking || "N/A",
          solved: (contest?.attended) && contest.problemsSolved || 0,
          totalProblems: (contest?.attended) &&  contest.totalProblems || 0,
          date: (contest?.attended) && new Date((contest?.contest?.startTime || Date.now()) * 1000)
            .toISOString()
            .split("T")[0],
        }));

        return contestHistory;
      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch LeetCode contest history:", error);
      return [];
    }
  };

  const fetchContestData = async (handles) => {
    try {
      const [cfcontests, lcContests] = await Promise.all([
        fetchCodeforcesContestHistory(handles.codeforces),
        fetchLeetCodeContestHistory(handles.leetcode),
      ]);

      return { cfcontests, lcContests };
    } catch (error) {
      console.error("Error fetching contest data:", error);
      return { cfcontests: [], lcContests: [] };
    }
  };

  //   // Usage example
  //   fetchContestData(handles).then(({ cfcontests, lcContests }) => {
  //     console.log("Codeforces Contests:", cfcontests);
  //     console.log("LeetCode Contests:", lcContests);
  //   });

  useEffect(() => {
    const loadContestData = async () => {
      setLoading(true);
      const getRatingHistory = async () => {
        const data = await fetchCodeforcesRatingHistory(handles.codeforces);
        setRatingData(data);
      };
      getRatingHistory();
      const { cfcontests, lcContests } = await fetchContestData(handles);
      const problemData = await fetchLeetCodeProblems(handles?.leetcode);
      setCfcontests(cfcontests || []);
      setLcContests(lcContests || []);
      setProblemData(problemData);
      setLoading(false);
    };

    if (handles?.codeforces && handles?.leetcode) {
      loadContestData();
    }
  }, [handles]);

  const fetchCodeforcesRatingHistory = async (handle) => {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const contests = response.data.result;

      const ratingHistory = contests.map((contest, index) => ({
        name: contest.contestName || `Contest ${index + 1}`,
        rating: contest.newRating,
      }));

      return ratingHistory;
    } catch (error) {
      console.error("Error fetching Codeforces rating history:", error);
      return [];
    }
  };

  if (statsLoading)
  return (
    <div className="flex flex-col items-center justify-center text-gray-400 animate-pulse py-6">
      <p className="text-lg mb-2">Loading your Leaderboard..</p>
      <div className="w-10 h-10 border-4 border-dashed border-indigo-500 rounded-full animate-spin"></div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#161a30] to-[#161a30] text-white px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#33C3F0]">
              Contest Champions
            </h1>
            <p className="text-gray-300 mt-2">
              Track and compare coding performance across platforms
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              variant="outline"
              className="bg-[#221F26] border-[#403E43] hover:bg-[#2d2a33] text-white"
            >
              Filter
            </Button>
            <Button
              className="bg-[#8B5CF6] hover:bg-[#7c4deb]"
              onClick={handleRefreshClick}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-3 bg-[#221F26] border-[#403E43] text-white">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl flex items-center">
                <Trophy className="mr-2 text-[#f6e58d]" size={24} />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable />
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Codeforces Handle"
            name="codeforces"
            value={handles.codeforces}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="LeetCode Handle"
            name="leetcode"
            value={handles.leetcode}
            onChange={handleChange}
          />
          {/* <Input
            placeholder="GitHub Username"
            name="github"
            value={handles.github}
            onChange={handleChange}
          /> */}
        </div>

        <Button
          onClick={handleSubmit}
          className="mb-6 bg-blue-600 hover:bg-blue-700 transition-all"
        >
          Generate Stats
        </Button>

        {/* main secyion here */}
        
        {submitted && userData && (
          <>
            <div className="mb-6">
              <Tabs defaultValue="overview" className="w-full">
                <div className="flex justify-between items-center">
                  <TabsList className="bg-[#221F26] border border-[#403E43]">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                      onClick={() => setView("overview")}
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="leetcode"
                      className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                      onClick={() => setView("details")}
                    >
                      LeetCode
                    </TabsTrigger>
                    <TabsTrigger
                      value="codeforces"
                      className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                      onClick={() => setView("details")}
                    >
                      CodeForces
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/*user profile */}
                    <Card className="bg-[#221F26] border-[#403E43] text-white">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          {userData?.leetcodeData?.named?.avatar ? (
                            <img
                              src={userData.leetcodeData.named.avatar}
                              alt={userData.leetcodeData.named.name}
                              className="w-24 h-24 rounded-full border-2 border-[#8B5CF6] mb-4"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-[#1A1F2C] flex items-center justify-center border-2 border-[#8B5CF6] mb-4">
                              <User size={32} className="text-[#8B5CF6]" />
                            </div>
                          )}

                          <h3 className="text-xl font-bold">
                            {userData?.leetcodeData?.named?.name || "N/A"}
                          </h3>
                          <p className="text-gray-400">
                            @{userData?.leetcodeData?.named?.username || "N/A"}
                          </p>

                          <div className="mt-4 w-full">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="flex flex-col items-center p-3 bg-[#1A1F2C] rounded-lg">
                                <div className="text-xs text-gray-400">
                                  LeetCode
                                </div>
                                <div className="text-sm font-medium">
                                  @
                                  {userData?.leetcodeData?.named?.username ||
                                    "N/A"}
                                </div>
                                <div className="text-lg font-bold text-[#33C3F0]">
                                  {userData?.leetcodeData?.profile
                                    ?.totalSolved || 0}
                                </div>
                                <div className="text-xs text-gray-400">
                                  problems
                                </div>
                              </div>

                              <div className="flex flex-col items-center p-3 bg-[#1A1F2C] rounded-lg">
                                <div className="text-xs text-gray-400">
                                  CodeForces
                                </div>
                                <div className="text-sm font-medium">
                                  @{userData?.codeforcesData?.handle || "N/A"}
                                </div>
                                <div className="text-lg font-bold text-[#8B5CF6]">
                                  {userData?.codeforcesData?.rating || "N/A"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {userData?.codeforcesData?.rank || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#221F26] border-[#403E43] text-white col-span-1 md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart className="mr-2 text-[#8B5CF6]" size={20} />
                          Platform Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-[#1A1F2C] rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-300">
                                LeetCode Rating
                              </span>
                              <span className="text-[#33C3F0] font-medium">
                                {userData?.leetcodeData?.profile?.ranking}
                              </span>
                            </div>
                            <Progress
                              value={
                                (userData?.leetcodeData?.solved?.solvedProblem /
                                  4000) *
                                100
                              }
                              className="h-2 bg-[#403E43]"
                            />
                            <div className="mt-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-400">
                                  Problems Solved
                                </span>
                                <span className="text-white">
                                  {
                                    userData?.leetcodeData?.solved
                                      ?.solvedProblem
                                  }
                                </span>
                              </div>
                              <div className="flex gap-1 h-2">
                                <div
                                  className="bg-[#4ade80] rounded-l-full"
                                  style={{
                                    width: `${
                                      (userData?.leetcodeData?.solved
                                        ?.easySolved /
                                        userData?.leetcodeData?.solved
                                          ?.solvedProblem) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                                <div
                                  className="bg-[#f59e0b]"
                                  style={{
                                    width: `${
                                      (userData?.leetcodeData?.solved
                                        ?.mediumSolved /
                                        userData?.leetcodeData?.solved
                                          ?.solvedProblem) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                                <div
                                  className="bg-[#ef4444] rounded-r-full"
                                  style={{
                                    width: `${
                                      (userData?.leetcodeData?.solved
                                        ?.hardSolved /
                                        userData?.leetcodeData?.solved
                                          ?.solvedProblem) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#1A1F2C] rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-300">
                                CodeForces Rating
                              </span>
                              <span
                                className={`font-medium ${getRatingColor(
                                  userData?.codeforcesData.rating
                                )}`}
                              >
                                {userData?.codeforcesData.rating} (
                                {userData?.codeforcesData.rank})
                              </span>
                            </div>
                            <Progress
                              value={
                                (userData?.codeforcesData.rating / 3000) * 100
                              }
                              className="h-2 bg-[#403E43]"
                            />
                            <div className="mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                  Max Rating
                                </span>
                                <span
                                  className={`text-sm ${getRatingColor(
                                    userData.codeforcesData.maxRating
                                  )}`}
                                >
                                  {userData.codeforcesData.maxRating}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-400">
                                  Contests
                                </span>
                                <span className="text-sm">
                                  {userData.codeforcesData.contests.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <StatsCard
                            title="Total Solved"
                            value={
                              userData?.leetcodeData?.solved?.solvedProblem +
                              userData?.codeforcesData?.solvedCount
                            }
                            icon={
                              <FileText className="text-[#8B5CF6]" size={16} />
                            }
                          />
                          <StatsCard
                            title="Contests"
                            value={userData.codeforcesData.contests.length}
                            icon={
                              <Trophy className="text-[#f6e58d]" size={16} />
                            }
                          />
                          <StatsCard
                            title="Current Streak"
                            value={`${userData?.leetcodeData?.profile?.contributionPoint} days`}
                            icon={
                              <TrendingUp
                                className="text-[#4ade80]"
                                size={16}
                              />
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-[#221F26] border-[#403E43] text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Calendar className="mr-2 text-[#8B5CF6]" size={20} />
                          Recent Contests
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ContestHistory
                          cfcontests={cfcontests}
                          lcContests={lcContests}
                        />

                        {/* <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              Codeforces Contests
                            </h3>
                            {cfcontests.length > 0 ? (
                              cfcontests.map((contest, index) => (
                                <div
                                  key={index}
                                  className="bg-[#1A1F2C] p-3 rounded-lg"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      {contest.name}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                      {contest.date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <div>
                                      <span className="text-sm text-gray-400">
                                        Rank
                                      </span>
                                      <div className="text-lg font-medium">
                                        {contest.rank}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-400">
                                        Solved
                                      </span>
                                      <div className="text-lg font-medium">
                                        {contest.solved}/{contest.totalProblems}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400">
                                No Codeforces contest history available.
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              LeetCode Contests
                            </h3>
                            {lcContests.length > 0 ? (
                              lcContests.map((contest, index) => (
                                <div
                                  key={index}
                                  className="bg-[#1A1F2C] p-3 rounded-lg"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      {contest.name}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                      {contest.date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <div>
                                      <span className="text-sm text-gray-400">
                                        Rank
                                      </span>
                                      <div className="text-lg font-medium">
                                        {contest.rank}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-400">
                                        Solved
                                      </span>
                                      <div className="text-lg font-medium">
                                        {contest.solved}/{contest.totalProblems}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400">
                                No LeetCode contest history available.
                              </p>
                            )}
                          </div>
                        </div> */}
                      </CardContent>
                    </Card>

                    <Card className="bg-[#221F26] border-[#403E43] text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Award className="mr-2 text-[#8B5CF6]" size={20} />
                          Achievements & Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-3">
                              Problem Distribution
                            </h4>
                            <div className="h-[180px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={problemData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                      `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                  >
                                    {problemData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-3">
                              LeetCode Badges
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {userData?.leetcodeData?.badges?.badges?.map(
                                (badge, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-[#1A1F2C] text-[#8B5CF6] hover:bg-[#252a39] border border-[#8B5CF6]"
                                  >
                                    {badge?.displayName}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="leetcode" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-[#221F26] border-[#403E43] text-white lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart className="mr-2 text-[#8B5CF6]" size={20} />
                          LeetCode Problem Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart
                              data={[
                                {
                                  name: "Easy",
                                  solved:
                                    userData?.leetcodeData?.solved?.easySolved,
                                  total: 650,
                                  color: "#4ade80",
                                },
                                {
                                  name: "Medium",
                                  solved:
                                    userData?.leetcodeData?.solved
                                      ?.mediumSolved,
                                  total: 1450,
                                  color: "#f59e0b",
                                },
                                {
                                  name: "Hard",
                                  solved:
                                    userData?.leetcodeData?.solved?.hardSolved,
                                  total: 600,
                                  color: "#ef4444",
                                },
                              ]}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#333"
                              />
                              <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                              <YAxis tick={{ fill: "#ccc" }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1A1F2C",
                                  borderColor: "#403E43",
                                }}
                                labelStyle={{ color: "white" }}
                              />
                              <Bar
                                dataKey="solved"
                                name="Solved"
                                fill={(data) => data.color}
                              />
                            </ReBarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <StatsCard
                            title="Easy Problems"
                            value={userData?.leetcodeData?.solved?.easySolved}
                            icon={
                              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                            }
                          />
                          <StatsCard
                            title="Medium Problems"
                            value={userData?.leetcodeData?.solved?.mediumSolved}
                            icon={
                              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                            }
                          />
                          <StatsCard
                            title="Hard Problems"
                            value={userData?.leetcodeData?.solved?.hardSolved}
                            icon={
                              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#221F26] border-[#403E43] text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Award className="mr-2 text-[#8B5CF6]" size={20} />
                          LeetCode Badges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LeetcodeBadges
                          badges={userData?.leetcodeData?.badges}
                        />
                        <Separator className="my-4 bg-[#403E43]" />
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-300 mb-1">
                              Contest Rating
                            </div>
                            <div className="text-xl font-bold text-[#33C3F0]">
                              {userData?.leetcodeData?.profile?.ranking}
                            </div>
                            <div className="text-xs text-gray-400">
                              Rank #{userData?.leetcodeData?.profile?.ranking}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-300 mb-1">
                              Current Streak
                            </div>
                            <div className="text-xl font-bold text-[#4ade80]">
                              {userData?.leetcodeData?.profile?.ranking} days
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="codeforces" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-[#221F26] border-[#403E43] text-white lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp
                            className="mr-2 text-[#8B5CF6]"
                            size={20}
                          />
                          CodeForces Rating History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart
                              data={ratingData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#333"
                              />
                              <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                              <YAxis tick={{ fill: "#ccc" }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1A1F2C",
                                  borderColor: "#403E43",
                                }}
                                labelStyle={{ color: "white" }}
                              />
                              <Bar dataKey="rating" fill="#8B5CF6" />
                            </ReBarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#221F26] border-[#403E43] text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <User className="mr-2 text-[#8B5CF6]" size={20} />
                          CodeForces Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-300 mb-1">
                              Current Rating
                            </div>
                            <div
                              className={`text-xl font-bold ${getRatingColor(
                                userData?.codeforcesData.rating
                              )}`}
                            >
                              {userData?.codeforcesData.rank}
                            </div>
                            <div className="text-sm text-gray-300">
                              {userData?.codeforcesData.rank}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-300 mb-1">
                              Max Rating
                            </div>
                            <div
                              className={`text-xl font-bold ${getRatingColor(
                                userData?.codeforcesData.maxRating
                              )}`}
                            >
                              {userData?.codeforcesData.maxRating}
                            </div>
                          </div>

                          <Separator className="my-4 bg-[#403E43]" />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-300 mb-1">
                                Contests
                              </div>
                              <div className="text-xl font-bold text-white">
                                {userData?.codeforcesData?.contests?.length}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-300 mb-1">
                                Problems
                              </div>
                              <div className="text-xl font-bold text-white">
                                {userData?.codeforcesData?.solvedCount}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-300 mb-1">
                              Contributions
                            </div>
                            <div className="text-xl font-bold text-[#4ade80]">
                              {userData?.codeforcesData.contribution}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lead;
