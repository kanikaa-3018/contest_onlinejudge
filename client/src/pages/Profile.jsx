import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleSubmissions, setVisibleSubmissions] = useState(3);
  const [visibleContests, setVisibleContests] = useState(3);
  const handle = localStorage.getItem("cfHandle") || "tourist";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, ratingRes, submissionsRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
        ]);

        const userInfo = userRes.data.result[0];
        const contests = ratingRes.data.result
          .slice()
          .reverse()
          .map((c, idx) => ({
            id: idx,
            name: c.contestName,
            rank: c.rank,
            rating: `${c.newRating - c.oldRating >= 0 ? "+" : ""}${c.newRating - c.oldRating}`,
            date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
            contestLink: `https://codeforces.com/contest/${c.contestId}`,
            standingsLink: `https://codeforces.com/contest/${c.contestId}/standings`,
          }));

        const submissions = submissionsRes.data.result
          .map((sub, idx) => ({
            id: sub.id || idx,
            problem: `${sub.problem.index}. ${sub.problem.name}`,
            difficulty: sub.problem.rating || "N/A",
            status: sub.verdict === "OK" ? "Accepted" : sub.verdict,
            date: new Date(sub.creationTimeSeconds * 1000).toLocaleDateString(),
            runtime: `${sub.timeConsumedMillis} ms`,
            contestId: sub.contestId,
            submissionId: sub.id,
            problemLink: `https://codeforces.com/contest/${sub.contestId}/problem/${sub.problem.index}`,
            submissionLink: `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`,
          }));

        setUserData({
          username: handle,
          name: `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim(),
          country: userInfo.country || "Unknown",
          badge: userInfo.rank,
          rating: userInfo.rating,
          ranking: userInfo.maxRank,
          recentSubmissions: submissions,
          contestHistory: contests,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Codeforces profile:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [handle]);

  const handleViewMoreSubmissions = () => setVisibleSubmissions((prev) => prev + 3);
  const handleViewMoreContests = () => setVisibleContests((prev) => prev + 3);

  if (loading || !userData) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="container py-6" style={{ backgroundColor: "#161A30" }}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 px-4">
          <Card className="bg-[#161A30] text-[#B6BBC4]">
            <CardHeader className="pb-2 px-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-[#31304D] p-6 w-24 h-24 flex items-center justify-center">
                  <User className="h-12 w-12 text-[#F0ECE5]" />
                </div>
              </div>
              <CardTitle className="text-center text-[#F0ECE5]">
                {userData.username}
              </CardTitle>
              <CardDescription className="text-center text-[#B6BBC4]">
                {userData.name} • {userData.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-2">
                <Badge className="text-sm bg-[#31304D] text-[#F0ECE5]">
                  {userData.badge}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-[#B6BBC4]">Ranking</span>
                  <span className="text-xl font-bold text-[#F0ECE5]">
                    {userData.ranking}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-[#B6BBC4]">Rating</span>
                  <span className="text-xl font-bold text-[#F0ECE5]">
                    {userData.rating}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="submissions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="submissions" className="text-[#B6BBC4] hover:text-[#F0ECE5]">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="contests" className="text-[#B6BBC4] hover:text-[#F0ECE5]">
                Contests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              {userData.recentSubmissions.slice(0, visibleSubmissions).map((sub) => (
                <Card key={sub.id} className="mb-4 bg-[#31304D] text-[#B6BBC4]">
                  <CardHeader>
                    <a
                      href={sub.problemLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0ECE5] text-lg hover:underline"
                    >
                      {sub.problem}
                    </a>
                    <CardDescription className="-mb-2">
                      <span className="font-bold">Date:</span> {sub.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      className={`text-[#F0ECE5] mb-1 -mt-2 ${
                        sub.status === "Accepted" ? "bg-[#4CAF50]" : "bg-[#EF4444]"
                      }`}
                    >
                      {sub.status}
                    </Badge>
                    <div>Difficulty: {sub.difficulty} • Runtime: {sub.runtime}</div>
                    <div className="mt-1 text-xs underline text-blue-400">
                      <a
                        href={sub.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white"
                      >
                        View Submission
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {visibleSubmissions < userData.recentSubmissions.length && (
                <button
                  onClick={handleViewMoreSubmissions}
                  className="text-blue-400 text-sm underline hover:text-white"
                >
                  View More
                </button>
              )}
            </TabsContent>

            <TabsContent value="contests">
              {userData.contestHistory.slice(0, visibleContests).map((contest) => (
                <Card key={contest.id} className="mb-4 bg-[#31304D] text-[#B6BBC4]">
                  <CardHeader>
                    <a
                      href={contest.contestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0ECE5] text-lg hover:underline"
                    >
                      {contest.name}
                    </a>
                    <CardDescription>{contest.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>Rank: {contest.rank} • Rating Change: {contest.rating}</div>
                    <div className="mt-1 text-xs underline text-blue-400">
                      <a
                        href={contest.standingsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white"
                      >
                        View Standings
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {visibleContests < userData.contestHistory.length && (
                <button
                  onClick={handleViewMoreContests}
                  className="text-blue-400 text-sm underline hover:text-white"
                >
                  View More
                </button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
