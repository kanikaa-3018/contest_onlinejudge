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
import { Input } from "@/components/ui/input"; // assuming shadcn/ui Input component

const RecentSubmissions = () => {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cfHandle, setCfHandle] = useState(localStorage.getItem("cfHandle") || "");
  const [inputHandle, setInputHandle] = useState("");

  useEffect(() => {
    if (!cfHandle) return;

    const fetchSubmissions = async () => {
      setLoading(true);
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
        setError("");
      } catch (err) {
        setError("Failed to fetch recent submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
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
        className="border w-[350px] mx-auto"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))"
        }}
      >
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your Codeforces handle to view recent submissions
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

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card 
      className="border"
      style={{
        backgroundColor: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))"
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription className="text-gray-400">
            Your latest code submissions
          </CardDescription>
        </div>
        <Code className="h-5 w-5 text-blue-500" />
      </CardHeader>
      <CardContent className="space-y-4 min-h-[400px]">
        {recentSubmissions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col space-y-2 rounded-md border p-3"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-500">{sub.problem}</span>
              <Badge
                className={`text-white ${
                  sub.status === "Accepted" ? "bg-green-500" : "bg-red-500"
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
        <Button variant="outline" className="border-blue-500 text-blue-500">
          View Submission History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentSubmissions;
