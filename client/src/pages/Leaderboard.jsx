import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaCode, FaTrophy, FaArrowUp, FaStar, FaGlobe } from "react-icons/fa";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Leaderboard = () => {
  const [handles, setHandles] = useState({
    codeforces: "",
    github: "",
    leetcode:"",
  });
  const [userData, setUserData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(document.documentElement.classList.contains('dark'));

  // Theme detection effect
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Theme-aware colors using CSS custom properties
  const getThemeColors = () => {
    return [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--primary))"
    ];
  };
  
  const getChartAxisColor = () => {
    return "hsl(var(--foreground))";
  };
  
  const getChartBarColor = () => {
    return "hsl(var(--primary))";
  };
  
  const COLORS = getThemeColors();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHandles((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const codeforcesData = await fetchCodeforcesData(handles.codeforces);
    let leetcodeData = null;
    try {
      leetcodeData = await fetchLeetCodeData(handles.leetcode);
    } catch (error) {
      console.error("LeetCode data not available:", error);
    }
    const githubData = await fetchGithubData(handles.github);
    setUserData({ codeforcesData, githubData, leetcodeData });
  };

  const fetchCodeforcesData = async (handle) => {
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

    const dailySolves = Object.entries(dailySolvesMap).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      ...userData,
      contests,
      solvedCount: solvedSet.size,
      dailySolves,
    };
  };

  const fetchLeetCodeData = async (handle) => {
    try {
      const profileResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/userProfile/${handle}`
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
        profile: profileResponse.data,
        badges: badgeResponse.data,
        solved: solvedResponse.data,
        contestHistory: contestHistoryResponse.data,
        submissionTree: submissionTreeResponse.data,
      };
    } catch (error) {
      console.error("Failed to fetch LeetCode data:", error);
      return null;
    }
  };

  const fetchGithubData = async (handle) => {
    const response = await axios.get(
      `https://api.github.com/users/${handle}/events`
    );
    const contributions = response.data;
    const contributionDates = contributions.map(
      (event) => event.created_at.split("T")[0]
    );
    return {
      contributions: contributionDates,
    };
  };

  const questionData = [
    {
      name: "Codeforces",
      value: userData?.codeforcesData.solvedCount || 0,
    },
    {
      name: "GitHub",
      value: userData?.githubData.contributions.length || 0,
    },
  ];

  const contestData = [
    {
      name: "Codeforces",
      contests: userData?.codeforcesData.contests.length || 0,
    },
    { name: "LeetCode", contests: 0 },
    { name: "CodeChef", contests: 0 },
    { name: "AtCoder", contests: 0 },
  ];

  const contributions = userData?.codeforcesData.dailySolves || [];

  const ratingChange =
    userData?.codeforcesData.contests.length > 1
      ? userData.codeforcesData.contests[
          userData.codeforcesData.contests.length - 1
        ].newRating -
        userData.codeforcesData.contests[
          userData.codeforcesData.contests.length - 2
        ].newRating
      : 0;

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Developer Leaderboard</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Codeforces Handle"
          name="codeforces"
          value={handles.codeforces}
          onChange={handleChange}
        />
        <Input
          placeholder="LeetCode Handle"
          name="leetcode"
          value={handles.leetcode}
          onChange={handleChange}
        />
        <Input
          placeholder="GitHub Username"
          name="github"
          value={handles.github}
          onChange={handleChange}
        />

      </div>

      <Button
        onClick={handleSubmit}
        className="mb-6 bg-primary hover:bg-primary/90 transition-all"
      >
        Generate Stats
      </Button>

      {submitted && userData && (
        <div className="mt-10 space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <div className="p-4 rounded-xl shadow-md bg-card border border-border text-card-foreground">
              <FaCode className="mx-auto mb-2 text-2xl text-primary" />
              <p className="font-semibold text-center">Total Solved</p>
              <p className="text-center text-3xl font-extrabold">
                {userData.codeforcesData.solvedCount}
              </p>
            </div>
            <div className="p-4 rounded-xl shadow-md bg-card border border-border text-card-foreground">
              <FaTrophy className="mx-auto mb-2 text-2xl text-primary" />
              <p className="font-semibold text-center">Contests Participated</p>
              <p className="text-center text-3xl font-extrabold">
                {userData.codeforcesData.contests.length}
              </p>
              <button
                onClick={() => setShowContestModal(true)}
                className="text-center italic text-xs underline text-primary hover:text-primary/80 align-center ml-16"
              >
                View List
              </button>
            </div>
            <div className="p-4 rounded-xl shadow-md bg-card border border-border text-card-foreground">
              <FaArrowUp className="mx-auto mb-2 text-2xl text-primary" />
              <p className="font-semibold text-center">Rating</p>
              <p className="text-center text-3xl font-extrabold">
                {userData.codeforcesData.rating}
              </p>
              <p className="text-center text-sm italic text-muted-foreground">
                Max: {userData.codeforcesData.maxRating}
              </p>
            </div>
            <div className="p-4 rounded-xl shadow-md bg-card border border-border text-card-foreground">
              <FaArrowUp className="mx-auto mb-2 text-2xl text-primary" />
              <p className="font-semibold text-center">Rating Change</p>
              <p className="text-center text-3xl font-extrabold">
                {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
              </p>
            </div>
            <div className="p-4 rounded-xl shadow-md bg-card border border-border text-card-foreground">
              <FaGlobe className="mx-auto mb-2 text-2xl text-primary" />
              <p className="font-semibold text-center">Rank</p>
              <p className="text-center text-3xl font-extrabold">
                {userData.codeforcesData.rank}
              </p>
              <p className="text-center text-sm italic text-muted-foreground">
                Max: {userData.codeforcesData.maxRank}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card rounded-xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Problems Solved by Platform
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={questionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {questionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Contests Participated
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contestData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke={getChartAxisColor()} />
                    <YAxis stroke={getChartAxisColor()} />
                    <Tooltip />
                    <Bar dataKey="contests" fill={getChartBarColor()} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card rounded-xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Contribution Activity
              </h3>
              <CalendarHeatmap
                startDate={new Date("2024-01-01")}
                endDate={new Date("2024-12-31")}
                values={contributions}
                classForValue={(value) => {
                  if (!value) return "color-empty";
                  return `color-github-${Math.min(value.count, 4)}`;
                }}
                tooltipDataAttrs={(value) => ({
                  "data-tip": `${value.date}: ${
                    value.count || 0
                  } problem(s) solved`,
                })}
                showWeekdayLabels
              />
              <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <div className="w-4 h-4 rounded bg-muted-foreground/20" />
                  <div className="w-4 h-4 rounded bg-muted-foreground/40" />
                  <div className="w-4 h-4 rounded bg-muted-foreground/60" />
                  <div className="w-4 h-4 rounded bg-muted-foreground/80" />
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          {showContestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-50">
              <div className="bg-card rounded-xl p-6 max-w-2xl w-full shadow-lg text-card-foreground">
                <h3 className="text-xl font-semibold mb-4">
                  Codeforces Contests
                </h3>
                <ul className="space-y-2 max-h-96 overflow-y-auto scroll-auto">
                  {userData?.codeforcesData.contests.map((contest, index) => (
                    <li key={index}>
                      <a
                        href={`https://codeforces.com/contest/${contest.contestId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {contest.contestName}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <Button
                    onClick={() => setShowContestModal(false)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
