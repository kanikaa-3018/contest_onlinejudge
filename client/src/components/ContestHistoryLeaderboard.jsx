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
import { Award } from "react-feather";

const ContestHistoryLeaderboard = () => {
  const [contestHistory, setContestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cfHandle = localStorage.getItem("cfHandle");

  useEffect(() => {
    const fetchRatingHistory = async () => {
      if (!cfHandle) {
        setError("Codeforces handle not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${cfHandle}`
        );
        const data = response.data.result.map((entry, index) => ({
          id: index + 1,
          contestName: entry.contestName,
          rank: entry.rank,
          oldRating: entry.oldRating,
          newRating: entry.newRating,
          delta: entry.newRating - entry.oldRating,
        }));
        setContestHistory(data.reverse().slice(0, 10)); // latest 10 only
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contest history.");
        setLoading(false);
      }
    };

    fetchRatingHistory();
  }, [cfHandle]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <h1 className="text-4xl font-bold mt-3 mb-5 ml-2">What else we offer?</h1>
    <Card className="bg-[#14142B] text-white border border-[#2A2A3B]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          
          <CardTitle>Contest History</CardTitle>
          <CardDescription className="text-gray-400">
            Your performance in past Codeforces contests
          </CardDescription>
        </div>
        <Award className="h-5 w-5 text-[#00FFC6]" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#2A2A3B]">
              <tr>
                {["Contest", "Rank", "Old", "New", "Δ Rating"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 uppercase text-xs text-[#00FFC6]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contestHistory.map((entry) => (
                <tr key={entry.id} className="border-b border-[#2A2A3B]">
                  <td className="px-4 py-3 font-medium">{entry.contestName}</td>
                  <td className="px-4 py-3">{entry.rank}</td>
                  <td className="px-4 py-3">{entry.oldRating}</td>
                  <td className="px-4 py-3">{entry.newRating}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      entry.delta >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="border-[#00FFC6] text-[#00FFC6]">
          View Full Rating Graph
        </Button>
      </CardFooter>
    </Card>
    </>
  );
  
};

export default ContestHistoryLeaderboard;
