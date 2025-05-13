import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
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
  const event = new Date(contest.start).toISOString();
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.name)}&dates=${event}/${event}`;
  window.open(url, "_blank");
  };

const Contests = () => {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAllPast, setShowAllPast] = useState(false);
  const [showAllRegistered, setShowAllRegistered] = useState(false);

  const {
    data: codeforces,
    isLoading: cfLoading,
    isError: cfError,
  } = useQuery({
    queryKey: ["codeforces"],
    queryFn: () => fetchContests("https://codeforces.com/api/contest.list"),
  });

  const {
    data: codechef,
    isLoading: ccLoading,
    isError: ccError,
  } = useQuery({
    queryKey: ["codechef"],
    queryFn: () => fetchContests("https://codechef-api.vercel.app/contests"),
  });

  if (cfLoading || ccLoading)
    return <div className="text-white p-4">Loading contests...</div>;
  if (cfError || ccError)
    return <div className="text-red-400 p-4">Error loading contests.</div>;

  let allContests = [
    ...(codeforces?.result || []).map((c) => ({
      ...c,
      site: "codeforces",
      start: new Date(c.startTimeSeconds * 1000),
      end: new Date((c.startTimeSeconds + c.durationSeconds) * 1000),
    })),
    ...(Array.isArray(codechef)
      ? codechef.map((c) => ({
          ...c,
          site: "codechef",
          start: new Date(c.start_time),
          end: new Date(c.end_time),
        }))
      : []),
  ];

  if (platformFilter !== "all") {
    allContests = allContests.filter((c) => c.site === platformFilter);
  }

  const now = new Date();
  const upcomingContests = allContests.filter((c) => c.start > now);
  const pastContests = allContests.filter((c) => c.end < now);
  const registeredContests = []; // Placeholder: hook up with user registrations

  const getIcon = (site) =>
    site === "codeforces" ? (
      <FaCode className="text-blue-400" />
    ) : (
      <FaTrophy className="text-yellow-400" />
    );

  const ContestCard = ({ contest }) => (
    <Card className="bg-[#1E1E2E] text-[#F0ECE5] w-full rounded-2xl shadow hover:shadow-2xl">
      <CardContent className="px-4 py-3 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {getIcon(contest.site)} {contest.name}
          </h3>
          <span className="text-xs uppercase bg-[#31304D] px-2 py-1 rounded">
            {contest.site}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
        <p className="text-sm">
          <strong>Duration:</strong>{" "}
          {(contest.durationSeconds / 3600).toFixed(2)} hrs
        </p>
        {contest.url && (
          <a
            href={contest.url}
            target="_blank"
            className="text-blue-300 hover:text-blue-100 text-sm underline flex gap-1 items-center"
          >
            <IoLogoGithub /> View Contest
          </a>
        )}
        <button
          onClick={() => handleAddToCalendar(contest)}
          className="mt-2 px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 flex items-center gap-1"
        >
          <FaCalendarPlus /> Add to Calendar
        </button>
      </CardContent>
    </Card>
  );

  const handleDateHover = (date) => {
    setHoveredDate(date);
    const list = allContests.filter(
      (c) => c.start.toDateString() === date.toDateString()
    );
    setTooltipContent(list.map((c) => c.name).join(", "));
  };

  return (
    <div className="p-6 bg-[#161A30] min-h-screen font-sans">
      <h2 className="text-3xl font-bold text-[#F0ECE5] mb-6">
        Contests Dashboard
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-6">
        <select
          className="bg-[#31304D] text-[#F0ECE5] p-3 rounded-md text-sm shadow"
          onChange={(e) => setPlatformFilter(e.target.value)}
          value={platformFilter}
        >
          <option value="all">All Platforms</option>
          <option value="codechef">Codechef</option>
          <option value="codeforces">Codeforces</option>
        </select>

        <Tooltip>
          <TooltipTrigger asChild>
            <div onMouseLeave={() => setHoveredDate(null)} className="relative">
              <DayPicker
                mode="single"
                onDayMouseEnter={handleDateHover}
                modifiers={{
                  highlighted: allContests.map((c) => c.start),
                }}
                modifiersClassNames={{
                  highlighted: "bg-[#31304D] text-white font-bold rounded-full",
                }}
                className="rounded-xl border border-[#31304D] shadow-lg text-[#F0ECE5] p-4 flex items-center justify-center text-center"
              />
            </div>
          </TooltipTrigger>
          {hoveredDate && tooltipContent && (
            <TooltipContent
              side="bottom"
              align="start"
              className="bg-[#1E1E2E] text-white p-4 rounded-lg shadow-lg max-w-sm"
            >
              <strong>Contests on {hoveredDate.toDateString()}</strong>
              <p>{tooltipContent}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-6">
        {["upcoming", "past", "registered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-[#31304D] text-white"
                : "bg-transparent text-[#B6BBC4] hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Contests
          </button>
        ))}
      </div>

      {/* Upcoming Contests */}
      {activeTab === "upcoming" && (
        <section className="mb-10">
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaHourglassHalf className="text-yellow-300" /> Upcoming Contests
          </h3>
          <div className="grid gap-4">
            {upcomingContests.length ? (
              upcomingContests.map((c, i) => (
                <ContestCard key={i} contest={c} />
              ))
            ) : (
              <p className="text-[#B6BBC4]">No upcoming contests.</p>
            )}
          </div>
        </section>
      )}

      {/* Past Contests */}
      {activeTab === "past" && (
        <section className="mb-10">
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-400" /> Past Contests
          </h3>
          <div className="grid gap-4">
            {(showAllPast ? pastContests : pastContests.slice(0, 5)).map(
              (c, i) => (
                <ContestCard key={i} contest={c} />
              )
            )}
          </div>
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

      {/* Registered Contests */}
      {activeTab === "registered" && (
        <section>
          <h3 className="text-2xl text-[#F0ECE5] font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-400" /> Registered Contests
          </h3>
          <div className="grid gap-4">
            {(showAllRegistered
              ? registeredContests
              : registeredContests.slice(0, 5)
            ).map((c, i) => (
              <ContestCard key={i} contest={c} />
            ))}
          </div>
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
    </div>
  );
};

export default Contests;
