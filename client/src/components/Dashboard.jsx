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
import { motion } from "framer-motion";
import UpcomingContests from "./UpcomingContests";
import RecentSubmissions from "./RecentSubmissions";
import ContestHistoryLeaderboard from "./ContestHistoryLeaderboard";
import StatsDashboard from "./StatsDashboard";
import VSCodeTypewriter from "./VSCodeTypewriter";

export const Dashboard = () => {
  const userData = localStorage.getItem("user");
  

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
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-[#1E1E2F] via-[#2E2E48] to-[#1E1E2F] rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 opacity-30 blur-3xl" />
        <motion.h1
          className="text-5xl font-extrabold tracking-tight text-white drop-shadow-xl"
          whileHover={{ scale: 1.1, color: "#FFD700" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Welcome to CodeArena
        </motion.h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Your ultimate companion to improve your problem-solving and coding
          skills through contests, analytics, and leaderboards.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: (
                <Sparkles className="text-[#00D1FF] mb-2 w-6 h-6 animate-pulse" />
              ),
              title: "Live Contest Tracker",
              desc: "Stay informed about upcoming and ongoing contests across platforms.",
            },
            {
              icon: (
                <Sparkles className="text-[#FFC300] mb-2 w-6 h-6 animate-pulse" />
              ),
              title: "Global Leaderboard",
              desc: "Compare your performance with coders worldwide in real-time.",
            },
            {
              icon: (
                <Sparkles className="text-[#00FFA3] mb-2 w-6 h-6 animate-pulse" />
              ),
              title: "Comprehensive Stats",
              desc: "Track submissions, problems solved, and progress over time.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-[#14142B] p-6 rounded-xl border border-[#2A2A3B] shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {feature.icon}
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <VSCodeTypewriter/>

      {/* Greeting Section */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-[#00FFC6]">
          Welcome back, User
        </h1>
        <p className="text-sm text-gray-400">
          Track your progress, join contests, and improve your coding skills
        </p>
      </motion.div>

      {/* Typewriter Effect for AI-Powered Dashboard Data */}
      <motion.div
        className="bg-[#1E1E2F] p-6 rounded-lg mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-gray-300 text-sm font-mono space-y-2">
          <p>{output}</p>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="flex flex-col h-full" 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatsDashboard />
        </motion.div>

        <motion.div
          className="flex flex-col h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <UpcomingContests />
        </motion.div>

        <motion.div
          className="flex flex-col h-full" 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <RecentSubmissions />
        </motion.div>
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
