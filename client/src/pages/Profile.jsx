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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import loading from "../assets/loading.gif";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate ,Link} from "react-router-dom";
import {motion} from "framer-motion"

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    country: "",
    badge: "",
    rating: null,
    ranking: "",
    leetcodeUsername: "",
    leetcodeRating: "",
    leetcodeRanking: "",
    leetcodeTopPercentage: "",
    recentSubmissions: [],
    contestHistory: [],
    leetcodeContests: [],
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cfUsername: userData.username || "",
    lcUsername: "",
  });
  const [loading, setLoading] = useState(true);
  const [visibleSubmissions, setVisibleSubmissions] = useState(3);
  const [visibleContests, setVisibleContests] = useState(3);
  const handle = localStorage.getItem("cfHandle") || "tourist";
  const leetcodeHandle = localStorage.getItem("lcHandle") || null;
  const user = localStorage.getItem("user");
  // console.log(leetcodeHandle)

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
            rating: `${c.newRating - c.oldRating >= 0 ? "+" : ""}${
              c.newRating - c.oldRating
            }`,
            date: new Date(
              c.ratingUpdateTimeSeconds * 1000
            ).toLocaleDateString(),
            contestLink: `https://codeforces.com/contest/${c.contestId}`,
            standingsLink: `https://codeforces.com/contest/${c.contestId}/standings`,
          }));

        const submissions = submissionsRes.data.result.map((sub, idx) => ({
          id: sub.id || idx,
          problem: `${sub.problem.index}. ${sub.problem.name}`,
          difficulty: sub.problem.rating || "N/A",
          status: sub.verdict === "OK" ? "Accepted" : sub.verdict,
          date: new Date(sub.creationTimeSeconds * 1000).toLocaleDateString(),
          timestamp: sub.creationTimeSeconds * 1000,
          runtime: `${sub.timeConsumedMillis} ms`,
          contestId: sub.contestId,
          submissionId: sub.id,
          problemLink: `https://codeforces.com/contest/${sub.contestId}/problem/${sub.problem.index}`,
          submissionLink: `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`,
          platform: "Codeforces",
        }));

        let leetcodeContests = [];
        let leetcodeSubmissions = [];
        let leetcodeData = [];

        try {
          const [lcContRes, lcSubRes, lcProfileRes] = await Promise.all([
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}/contest/history`
            ),
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}/submission`
            ),
            axios.get(
              `https://alfa-leetcode-api.onrender.com/${leetcodeHandle}`
            ),
          ]);
          // console.log(lcContRes);
          // console.log(lcSubRes);
          // console.log(lcProfileRes)

          leetcodeData = {
            name: lcProfileRes.data.name,
            username: lcProfileRes.data.username, //fine
            rating: lcProfileRes.data.ranking || "N/A",
            globalRanking: lcProfileRes.data.ranking || "N/A",
            attendedContests: lcContRes?.data?.contestHistory.filter || 0,
            topPercentage:
              lcProfileRes.data.userContestRanking?.topPercentage || "N/A",
            profileLink: `https://leetcode.com/${leetcodeHandle}`,
          };
          // console.log("lc", leetcodeData);
          if (lcContRes.data && lcContRes.data.contestHistory) {
            leetcodeContests = lcContRes.data.contestHistory
              .filter((contest) => contest.attended)
              .map((contest, idx) => ({
                id: idx,
                name: contest.contest?.title || "Unknown Contest",
                rank: contest.ranking || "N/A",
                solved: contest.problemsSolved || 0,
                totalProblems: contest.totalProblems || 0,
                date: new Date(
                  (contest.contest?.startTime || Date.now()) * 1000
                ).toLocaleDateString(),
                platform: "LeetCode",
              }));
          }
          // console.log("con",leetcodeContests)

          if (lcSubRes.data && lcSubRes.data.submission) {
            leetcodeSubmissions = lcSubRes.data?.submission?.map(
              (sub, idx) => ({
                id: `lc${idx}`,
                problem: sub.title,
                language: sub.lang,
                status: sub.statusDisplay,
                date: new Date(
                  parseInt(sub.timestamp) * 1000
                ).toLocaleDateString(),
                timestamp: parseInt(sub.timestamp) * 1000,
                problemLink: `https://leetcode.com/problems/${sub.titleSlug}/`,
                submissionLink: `https://leetcode.com/submissions/detail/${
                  sub.id || idx
                }/`,
                platform: "LeetCode",
              })
            );
          }

          // console.log("sub", leetcodeSubmissions)
        } catch (error) {
          console.warn(
            "LeetCode API fetch failed, skipping LeetCode data",
            error
          );
        }

        const newUserData = {
          username: handle,
          name: leetcodeData.name,
          country: userInfo.country || "India",
          leetcodeUsername: leetcodeData.username,
          leetcodeRanking: leetcodeData.globalRanking,
          badge: userInfo.rank,
          rating: userInfo.rating,
          ranking: userInfo.maxRank,
          recentSubmissions: [...submissions, ...leetcodeSubmissions].sort(
            (a, b) => b.timestamp - a.timestamp
          ),
          contestHistory: contests,
          leetcodeContests: leetcodeContests,
        };
        // console.log(newUserData.recentSubmissions)

        // console.log("Setting userData to:", newUserData);
        setUserData(newUserData);
        // console.log("profile",userData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Codeforces profile:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [handle, leetcodeHandle]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/update-handles", {
        codeforces: formData.cfUsername,
        leetcode: formData.lcUsername,
      });

      setUserData((prev) => ({
        ...prev,
        username: formData.cfUsername,
      }));
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating usernames:", err);
    }
  };
  const handleViewMoreSubmissions = () =>
    setVisibleSubmissions((prev) => prev + 3);
  const handleViewMoreContests = () => setVisibleContests((prev) => prev + 3);

  if (loading || !userData)
    return (
      <div className="text-center text-gray-400 animate-pulse items-center mt-56 min-h-screen">
        <p className="text-lg">Loading your Profile...</p>
        <div className="mt-2 w-12 h-12 mx-auto border-4 border-dashed border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center  text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-white tracking-wide">
          Please log in to continue
        </h1>

        <Link
          to="/auth"
          className="inline-block mt-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out text-white font-semibold text-lg shadow-md hover:scale-105"
        >
          Go to Login Page →
        </Link>

        <p className="text-sm mt-4 text-gray-400">
          Don't have an account? <a href="/auth" className="text-blue-400 underline">Sign up now</a>
        </p>
      </motion.div>
    </div>
  );
}

  return (
    <div
      className="container mx-auto px-4 py-6"
      style={{ backgroundColor: "#161A30" }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {/* User Info Card */}
        <div className="md:col-span-1 px-0 md:px-4">
          <Card className="bg-[#161A30] text-[#B6BBC4] shadow-lg rounded-2xl overflow-hidden w-full max-w-md mx-auto md:mx-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-28 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full bg-[#31304D] p-4 w-24 h-24 flex items-center justify-center border-4 border-[#161A30]">
                  <User className="h-12 w-12 text-[#F0ECE5]" />
                </div>
              </div>
            </div>

            <CardHeader className="pt-16 pb-2 px-4 text-center">
              <CardTitle className="text-[#F0ECE5] text-xl truncate">
                {userData.name || "Your Handle"}
              </CardTitle>
              <CardDescription className="text-[#B6BBC4] truncate">
                {userData.username} • {userData.leetcodeUsername}
              </CardDescription>
              <button
                onClick={() => setEditModalOpen(true)}
                className="text-xs text-blue-400 underline mt-1 hover:text-white"
              >
                Edit Username
              </button>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center mb-3 gap-2">
                {userData.country && (
                  <Badge className="text-sm bg-[#31304D] text-[#F0ECE5]">
                    {userData.country}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-sm text-[#B6BBC4]">CF Rating</div>
                  <div className="text-xl font-bold text-[#F0ECE5]">
                    {userData.rating ?? "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#B6BBC4]">Ranking</div>
                  <div className="text-xl font-bold text-[#F0ECE5]">
                    {userData.ranking || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#B6BBC4]">LC Rating</div>
                  <div className="text-xl font-bold text-[#F0ECE5]">
                    {userData.leetcodeRanking ?? "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-center">
                <div className="mb-2">Recent Submissions</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {userData.recentSubmissions.slice(0, 4).map((sub, idx) => (
                    <Badge
                      key={idx}
                      className="bg-[#31304D] text-[#F0ECE5] text-xs"
                    >
                      {sub.platform}: {sub.problem}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <div className="md:col-span-2 px-0 md:px-4 mt-8 md:mt-0 max-w-full overflow-x-auto">
          <Tabs defaultValue="submissions" className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="submissions"
                className="text-[#B6BBC4] hover:text-[#F0ECE5]"
              >
                Submissions
              </TabsTrigger>
              <TabsTrigger
                value="contests"
                className="text-[#B6BBC4] hover:text-[#F0ECE5]"
              >
                Codeforces Contests
              </TabsTrigger>
              <TabsTrigger
                value="lcContests"
                className="text-[#B6BBC4] hover:text-[#F0ECE5]"
              >
                Leetcode Contests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              {userData.recentSubmissions
                .slice(0, visibleSubmissions)
                .map((sub) => (
                  <Card
                    key={sub.id}
                    className="mb-4 bg-[#31304D] text-[#B6BBC4]"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <a
                          href={sub.problemLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F0ECE5] text-lg hover:underline truncate max-w-[70vw]"
                        >
                          {sub.problem}
                        </a>
                        <Badge className="text-black bg-[rgb(254,254,254,0.3)] rounded-sm hover:text-white hover:bg-[rgb(255,255,255,0.1)]">
                          {sub.platform}
                        </Badge>
                      </div>
                      <CardDescription className="-mb-2">
                        <span className="font-bold">Date:</span> {sub.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        className={`text-[#F0ECE5] mb-1 -mt-2 ${
                          sub.status === "Accepted"
                            ? "bg-[#4CAF50]"
                            : "bg-[#EF4444]"
                        }`}
                      >
                        {sub.status}
                      </Badge>

                      {sub.platform === "Codeforces" && (
                        <div>
                          Difficulty: {sub.difficulty} • Runtime: {sub.runtime}
                        </div>
                      )}

                      {sub.platform === "LeetCode" && (
                        <div>Language: {sub.language}</div>
                      )}

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
              {userData.contestHistory
                .slice(0, visibleContests)
                .map((contest) => (
                  <Card
                    key={contest.id}
                    className="mb-4 bg-[#31304D] text-[#B6BBC4]"
                  >
                    <CardHeader>
                      <a
                        href={contest.contestLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F0ECE5] text-lg hover:underline truncate"
                      >
                        {contest.name}
                      </a>
                      <CardDescription>{contest.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        Rank: {contest.rank} • Rating Change: {contest.rating}
                      </div>
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

            <TabsContent value="lcContests">
              {userData.leetcodeContests &&
              userData.leetcodeContests.length > 0 ? (
                userData.leetcodeContests.map((contest) => (
                  <Card
                    key={contest.id}
                    className="mb-4 bg-[#31304D] text-[#B6BBC4]"
                  >
                    <CardHeader>
                      <CardTitle className="text-[#F0ECE5] text-lg hover:underline truncate">
                        {contest.name}
                      </CardTitle>
                      <CardDescription>{contest.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Rank: {contest.rank} • Solved: {contest.solved} /{" "}
                        {contest.totalProblems}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-white flex flex-col items-center">
                  <img
                    src="https://user-images.githubusercontent.com/74038190/218265814-3084a4ba-809c-4135-afc0-8685d0f634b3.gif"
                    className="h-60"
                    alt="No data"
                  />
                  <h2>Sorry:(( No LeetCode contest data available</h2>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {editModalOpen && (
          <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="bg-[#1A1B2E] text-white">
              <DialogHeader>
                <DialogTitle>Update Platform Handles</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateUsername} className="space-y-4 mt-2">
                <Label htmlFor="cf">Codeforces Handle</Label>
                <Input
                  id="cf"
                  value={formData.cfUsername}
                  onChange={(e) =>
                    setFormData({ ...formData, cfUsername: e.target.value })
                  }
                />

                <Label htmlFor="lc">LeetCode Username</Label>
                <Input
                  id="lc"
                  value={formData.lcUsername}
                  onChange={(e) =>
                    setFormData({ ...formData, lcUsername: e.target.value })
                  }
                />

                <Button type="submit" className="mt-2 w-full">
                  Save & Update
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Profile;
