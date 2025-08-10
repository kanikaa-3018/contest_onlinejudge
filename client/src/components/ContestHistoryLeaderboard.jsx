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
import { Input } from "@/components/ui/input"; // Assuming you use shadcn/ui or similar

const ContestHistoryLeaderboard = () => {
  const [contestHistory, setContestHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cfHandle, setCfHandle] = useState(localStorage.getItem("cfHandle") || "");
  const [inputHandle, setInputHandle] = useState("");

  useEffect(() => {
    if (!cfHandle) return;

    const fetchRatingHistory = async () => {
      setLoading(true);
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
        setContestHistory(data.reverse().slice(0, 10));
      } catch (err) {
        setError("Failed to fetch contest history. Please check your handle.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingHistory();
  }, [cfHandle]);

  const handleLogin = () => {
    if (inputHandle.trim()) {
      localStorage.setItem("cfHandle", inputHandle.trim());
      setCfHandle(inputHandle.trim());
      setError("");
    } else {
      setError("Please enter a valid handle.");
    }
  };

  if (!cfHandle) {
    return (
      <Card 
        className="border max-w-lg mx-auto mt-8"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))"
        }}
      >
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Missing Handle? Login now</CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-400">
            Enter your Codeforces handle to view contest history
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Codeforces handle"
            className="border"
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              borderColor: "hsl(var(--border))"
            }}
            value={inputHandle}
            onChange={(e) => setInputHandle(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleLogin} className="bg-blue-600 text-white hover:bg-blue-700">
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold mt-4 mb-6 ml-2 text-white">
        What else we offer?
      </h1>

      <Card 
        className="border"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))"
        }}
      >
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Contest History</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-400">
              Your performance in past Codeforces contests
            </CardDescription>
          </div>
          <Award className="h-5 w-5 text-blue-500" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Table view for desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-[700px] w-full text-left">
              <thead style={{ backgroundColor: "hsl(var(--muted))" }}>
                <tr>
                  {["Contest", "Rank", "Old", "New", "Δ Rating"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-xs text-blue-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contestHistory.map((entry) => (
                  <tr 
                    key={entry.id} 
                    className="border-b"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
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

          {/* Card view for mobile */}
          <div className="flex flex-col gap-4 sm:hidden">
            {contestHistory.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 shadow-sm"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))"
                }}
              >
                <p className="font-semibold text-blue-500 text-sm mb-2">
                  {entry.contestName}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-white">
                  <div>
                    <p className="text-gray-400">Rank</p>
                    <p>{entry.rank}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Old Rating</p>
                    <p>{entry.oldRating}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">New Rating</p>
                    <p>{entry.newRating}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Δ Rating</p>
                    <p
                      className={`font-semibold ${
                        entry.delta >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 w-full sm:w-auto"
            onClick={() => window.location.href = "/rating-graph"}
          >
            View Full Rating Graph
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ContestHistoryLeaderboard;
