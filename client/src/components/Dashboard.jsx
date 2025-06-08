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
import { Timer, Brain, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Code, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import UpcomingContests from "./UpcomingContests";
import RecentSubmissions from "./RecentSubmissions";
import ContestHistoryLeaderboard from "./ContestHistoryLeaderboard";
import StatsDashboard from "./StatsDashboard";
import VSCodeTypewriter from "./VSCodeTypewriter";
import GoogleSheetSummary from "./GoogleSheetSummary";
import MainHero from "./MainHero";
import AIIntegrationShowcase from "./AIIntegrationShowcase";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("user"));


  const [output, setOutput] = useState("");
  const textLines = [
    "AI is fetching your coding data...",
    "AI is analyzing your coding patterns...",
    "AI-powered recommendations are being generated...",
    "AI is evaluating your coding progress...",
    "AI is preparing your leaderboard data...",
  ];

  // Typewriter Effect
  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < textLines[lineIndex].length) {
        setOutput((prev) => prev + textLines[lineIndex].charAt(charIndex));
        charIndex++;
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex >= textLines.length) {
          clearInterval(typeInterval);
        }
      }
    }, 100);

   
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <motion.div
      className="container py-6 space-y-8 px-4"
      style={{ backgroundColor: "#161A30", color: "#E0E0E0" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <MainHero />
      {/* Greeting Section */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* {userData ? (
          <h1 className="text-3xl font-bold tracking-tight text-[#00FFC6] mt-8 ">
            Welcome back, {userData?.username}
          </h1>
        ) : (
          <h1 className="text-3xl font-bold tracking-tight text-[#00FFC6] mt-8 ">
            Welcome back, user
          </h1>
        )} */}
        <p className="text-sm text-gray-400">
          Track your progress, join contests, and improve your coding skills
        </p>
      </motion.div>
      <GoogleSheetSummary />

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <motion.div
          className="h-full flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatsDashboard className="h-full flex flex-col" />
        </motion.div>

        <motion.div
          className="h-full flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <UpcomingContests className="h-full flex flex-col" />
        </motion.div>

        <motion.div
          className="h-full flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <RecentSubmissions className="h-full flex flex-col" />
        </motion.div>
      </div>

      <AIIntegrationShowcase />

      {/* <VSCodeTypewriter /> */}
      <motion.div
        className="p-6 rounded-lg mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-gray-300 text-sm font-mono space-y-2">
          <p>{output}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <ContestHistoryLeaderboard />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
