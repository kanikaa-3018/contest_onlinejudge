import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Code } from "react-feather";

const RecentSubmissions = () => {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cfHandle = localStorage.getItem("cfHandle");

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!cfHandle) {
        setError("Codeforces handle not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=3`
        );
        const submissions = response.data.result.map((sub) => ({
          id: sub.id,
          problem: `${sub.problem.index}. ${sub.problem.name}`,
          status: sub.verdict === "OK" ? "Accepted" : sub.verdict,
          runtime: `${sub.timeConsumedMillis} ms`,
          language: sub.programmingLanguage,
        }));
        setRecentSubmissions(submissions);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recent submissions.");
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [cfHandle]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card className="bg-[#14142B] text-white border border-[#2A2A3B]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription className="text-gray-400">
            Your latest code submissions
          </CardDescription>
        </div>
        <Code className="h-5 w-5 text-[#00FFC6]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {recentSubmissions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col space-y-2 rounded-md border p-3 border-[#2A2A3B]"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#00FFC6]">{sub.problem}</span>
              <Badge
                className={`text-white ${
                  sub.status === "Accepted" ? "bg-[#00FFA3]" : "bg-[#EF4444]"
                }`}
              >
                {sub.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              Runtime: {sub.runtime}
              <span className="mx-2">•</span>
              Language: {sub.language}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="border-[#00FFC6] text-[#00FFC6]"
        >
          View Submission History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentSubmissions;
