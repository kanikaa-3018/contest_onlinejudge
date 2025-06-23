import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import MyCalendar from "../components/MyCalendar";
import "react-day-picker/dist/style.css";
import { motion } from "framer-motion";
import {
  FaCode,
  FaTrophy,
  FaClock,
  FaCalendarPlus,
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const fetchContests = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch contests");
  return response.json();
};

const handleAddToCalendar = (contest) => {
  const startISO = contest.start.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endISO = contest.end.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    contest.name
  )}&dates=${startISO}/${endISO}`;
  window.open(url, "_blank");
};

const Contests = () => {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipColor, setTooltipColor] = useState("#333");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAllPast, setShowAllPast] = useState(false);
  const [showAllRegistered, setShowAllRegistered] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: codeforces,
    isLoading: cfLoading,
    isError: cfError,
  } = useQuery({
    queryKey: ["codeforces"],
    queryFn: () => fetchContests("https://codeforces.com/api/contest.list"),
  });

  // const {
  //   data: codechef,
  //   isLoading: ccLoading,
  //   isError: ccError,
  // } = useQuery({
  //   queryKey: ["codechef"],
  //   queryFn: () => fetchContests("https://codechef-api.vercel.app/contests"),
  // });

  if (cfLoading)
    return (
      <div className="text-center text-gray-400 animate-pulse items-center mt-40 min-h-screen">
        <p className="text-lg">Loading Contests...</p>
        <div className="mt-2 w-12 h-12 mx-auto border-4 border-dashed border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );

  if (cfError )
    return <div className="text-red-400 p-4">Error loading contests.</div>;

  let allContests = [
    ...(codeforces?.result || []).map((c) => ({
      ...c,
      site: "codeforces",
      start: new Date(c.startTimeSeconds * 1000),
      end: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
    })),
    
  ];

  if (platformFilter !== "all") {
    allContests = allContests.filter((c) => c.site === platformFilter);
  }

  const now = new Date();
  const upcomingContests = allContests.filter((c) => c.start > now);
  const pastContests = allContests.filter((c) => c.end < now);
  const registeredContests = [];

  const getIcon = (site) =>
    site === "codeforces" ? (
      <FaCode className="text-blue-400" />
    ) : (
      <FaTrophy className="text-yellow-400" />
    );

const ContestCard = ({ contest }) => (
  <motion.div
    className="w-full"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-[#1E1E2E] text-[#F0ECE5] w-full rounded-2xl shadow hover:shadow-2xl">
      <CardContent className="px-3 sm:px-4 py-3 space-y-3">
        <div className="flex justify-between items-start sm:items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            {getIcon(contest.site)} {contest.name}
          </h3>
          <span className="text-xs uppercase bg-[#31304D] px-2 py-1 rounded whitespace-nowrap">
            {contest.site}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
          <div className="flex gap-2 items-center">
            <FaCalendarAlt className="text-[#B6BBC4]" />
            <span>
              <strong>Start:</strong> {contest.start.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <FaClock className="text-[#B6BBC4]" />
            <span>
              <strong>End:</strong> {contest.end.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base">
          <strong>Duration:</strong>{" "}
          {contest.durationSeconds
            ? (contest.durationSeconds / 3600).toFixed(2)
            : (
                (contest.end.getTime() - contest.start.getTime()) /
                3600000
              ).toFixed(2)}{" "}
          hrs
        </p>

        {contest.url && (
          <a
            href={contest.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 hover:text-blue-100 text-sm underline flex gap-1 items-center"
          >
            <IoLogoGithub /> View Contest
          </a>
        )}

        <button
          onClick={() => handleAddToCalendar(contest)}
          className="mt-2 px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 rounded text-white hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
        >
          <FaCalendarPlus /> Add to Calendar
        </button>
      </CardContent>
    </Card>
  </motion.div>
);


  const contestsByDate = {};
  allContests.forEach((contest) => {
    let currentDate = new Date(contest.start);
    currentDate.setHours(0, 0, 0, 0);
    const endDate = new Date(contest.end);
    endDate.setHours(0, 0, 0, 0);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (!contestsByDate[dateKey]) contestsByDate[dateKey] = [];
      contestsByDate[dateKey].push(contest);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  const modifiers = {
    contestDays: Object.keys(contestsByDate).map((d) => new Date(d)),
  };

  const dayStyle = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    const contests = contestsByDate[dateKey];

    if (!contests) {
      return {
        backgroundColor: "white", // or "transparent"
        color: "black",
      };
    }

    const hasCF = contests.some((c) => c.site === "codeforces");
    // const hasCC = contests.some((c) => c.site === "codechef");

    if (hasCF) {
      return {
        backgroundColor: "#3b82f6",
        color: "white",
      };
    }

    // if (hasCC) {
    //   return {
    //     backgroundColor: "#facc15",
    //     color: "black",
    //   };
    // }

    return {};
  };

  const onDayMouseEnter = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    if (contestsByDate[dateKey]) {
      setHoveredDate(date);
      setTooltipContent(
        contestsByDate[dateKey]
          .map((c) => `${c.name} (${c.site.toUpperCase()})`)
          .join("\n")
      );
      const firstSite = contestsByDate[dateKey][0].site;
      setTooltipColor(firstSite === "codeforces" ? "#3b82f6" : "#facc15");
    } else {
      setHoveredDate(null);
      setTooltipContent(null);
    }
  };

  const onDayMouseLeave = () => {
    setHoveredDate(null);
    setTooltipContent(null);
  };

  return (
    <motion.div className="p-6 bg-[#161A30] min-h-screen font-sans">
      <h2 className="text-3xl font-bold text-[#F0ECE5] mb-6">
        Contests Dashboard
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-6">
        <select
          className="bg-[#31304D] text-[#F0ECE5] py-2 px-3 rounded-md text-sm shadow"
          onChange={(e) => setPlatformFilter(e.target.value)}
          value={platformFilter}
        >
          <option value="all">All Platforms</option>
          <option value="codechef">Codechef</option>
          <option value="codeforces">Codeforces</option>
        </select>

        <div className="flex-1 max-w-full mr-26">
          {isSmallScreen ? (
            <Tooltip open={!!tooltipContent}>
              <TooltipTrigger asChild>
                <div>
                  <DayPicker
                    mode="single"
                    modifiers={modifiers}
                    onDayMouseEnter={onDayMouseEnter}
                    onDayMouseLeave={onDayMouseLeave}
                    selected={hoveredDate}
                    showOutsideDays
                    styles={{
                      day: {
                        borderRadius: "50%",
                      },
                    }}
                    components={{
                      DayContent: ({ date }) => {
                        const dateKey = date.toISOString().split("T")[0];
                        const contests = contestsByDate[dateKey];

                        const tooltip =
                          contests && contests.length > 0
                            ? contests
                                .map((c) => `${c.site}: ${c.name}`)
                                .join("\n")
                            : "";

                        return (
                          <div
                            title={tooltip}
                            style={dayStyle(date)}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-400 rounded-full hover:scale-105 transition-all duration-150"
                          >
                            {date.getDate()}
                          </div>
                        );
                      },
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="whitespace-pre-wrap"
                style={{
                  backgroundColor: tooltipColor,
                  color: tooltipColor === "#facc15" ? "#000" : "#fff",
                }}
              >
                {tooltipContent || "No contests"}
              </TooltipContent>
            </Tooltip>
          ) : (
            <MyCalendar />
          )}
        </div>
      </div>

      <div className="flex justify-center gap-6 mb-6 mt-40">
        {["upcoming", "past", "registered"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-[#31304D] text-white"
                : "bg-transparent text-[#B6BBC4] hover:text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Contests
          </motion.button>
        ))}
      </div>

      {activeTab === "upcoming" && (
        <section className="mb-10">
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaHourglassHalf className="text-yellow-300" /> Upcoming Contests
          </h3>
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {upcomingContests.length ? (
              upcomingContests.map((c, i) => (
                <ContestCard key={i} contest={c} />
              ))
            ) : (
              <p className="text-[#B6BBC4]">No upcoming contests.</p>
            )}
          </motion.div>
        </section>
      )}

      {activeTab === "past" && (
        <section className="mb-10">
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-400" /> Past Contests
          </h3>
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {(showAllPast ? pastContests : pastContests.slice(0, 5)).map(
              (c, i) => (
                <ContestCard key={i} contest={c} />
              )
            )}
          </motion.div>
          {pastContests.length > 5 && (
            <button
              onClick={() => setShowAllPast((prev) => !prev)}
              className="mt-4 px-4 py-2 bg-[#31304D] text-white rounded hover:bg-[#3e3c5a]"
            >
              {showAllPast ? "Show Less" : "Show More"}
            </button>
          )}
        </section>
      )}

      {activeTab === "registered" && (
        <section>
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-400" /> Registered Contests
          </h3>
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {(showAllRegistered
              ? registeredContests
              : registeredContests.slice(0, 5)
            ).map((c, i) => (
              <ContestCard key={i} contest={c} />
            ))}
          </motion.div>
          {registeredContests.length > 5 && (
            <button
              onClick={() => setShowAllRegistered((prev) => !prev)}
              className="mt-4 px-4 py-2 bg-[#31304D] text-white rounded hover:bg-[#3e3c5a]"
            >
              {showAllRegistered ? "Show Less" : "Show More"}
            </button>
          )}
        </section>
      )}
    </motion.div>
  );
};

export default Contests;
