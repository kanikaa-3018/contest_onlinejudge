import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "react-feather";
import axios from "axios";

const UpcomingContests = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const codeforcesResponse = await axios.get(
          "https://codeforces.com/api/contest.list"
        );
        const codeforcesContests = codeforcesResponse.data.result.filter(
          (contest) => contest.phase === "BEFORE"
        );

        const contests = codeforcesContests.map((contest) => ({
          id: contest.id,
          title: contest.name,
          date: new Date(contest.startTimeSeconds * 1000).toLocaleDateString(),
          time: new Date(contest.startTimeSeconds * 1000).toLocaleTimeString(),
          difficulty: "N/A",
          participants: "N/A",
        }));

        contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds); // sort by actual time

        setUpcomingContests(contests);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contest data");
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="bg-[#14142B] text-white border border-[#2A2A3B]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Contests</CardTitle>
          <CardDescription className="text-gray-400">
            Stay updated on contests
          </CardDescription>
        </div>
        <Calendar className="h-5 w-5 text-[#00FFC6]" />
      </CardHeader>

      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {upcomingContests.slice(0, visibleCount).map((contest) => (
          <div
            key={contest.id}
            className="flex flex-col space-y-2 rounded-md border p-3 border-[#2A2A3B]"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#00FFC6]">{contest.title}</span>
              <Badge className="bg-[#00D1FF] text-white">
                {contest.difficulty}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span>{contest.date}</span>
              <span className="mx-2">•</span>
              <span>{contest.time}</span>
            </div>
            <div className="text-sm text-gray-400">
              {contest.participants} participants registered
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="border-[#00FFC6] text-[#00FFC6]"
          onClick={handleShowMore}
          disabled={visibleCount >= upcomingContests.length}
        >
          {visibleCount >= upcomingContests.length
            ? "No More Contests"
            : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingContests;
