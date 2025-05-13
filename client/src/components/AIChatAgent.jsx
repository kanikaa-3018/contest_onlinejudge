import React, { useState, useEffect } from "react";

const RELEVANCE_API_KEY = import.meta.env.VITE_RELEVANCE_AI_KEY;
const RELEVANCE_WEBHOOK_URL =
  "https://api-d7b62b.stack.tryrelevance.com/latest/studios/31af573e-0354-42f9-b0f3-9f5e051d7b12/trigger_webhook?project=7b16571e94ae-4633-b9aa-0a89292427df";

const AIChatAgent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) {
          setEmail(parsed.email);
        }
      } catch (err) {
        console.error("Invalid user in localStorage");
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // If input requests progress explicitly, fetch progress first
    let progressData = "";
    if (input.toLowerCase().includes("my progress") || input.toLowerCase().includes("how much completed")) {
      if (!email) {
        const msg = {
          role: "assistant",
          content:
            "We couldn't find your email in localStorage. Please provide your registered email to fetch your progress.",
        };
        setMessages((prev) => [...prev, msg]);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/progress/getProgress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          const data = await res.json();
          progressData = `
User's progress summary:
${data.followedSheets.map((sheet) => {
  const s = data.progress[sheet];
  return `- ${sheet}: ${s.completed}/${s.total} completed. Current topic: ${s.currentTopic}`;
}).join("\n")}
`;
        } else {
          progressData = "Sorry, I couldn't find your progress in the system.";
        }
      } catch (err) {
        progressData = "There was an error fetching your progress.";
      }
    }

    const finalPrompt = `
You are an intelligent AI assistant embedded in a DSA learning platform. Your purpose is to assist users with the following tasks:

1. Answer DSA-related questions using reliable, structured DSA sheets that the user follows. Supported sheets include:

- Striver’s SDE Sheet: https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/
- NeetCode 150: https://neetcode.io/
- Love Babbar Sheet: https://450dsa.com/

2. Reference topics from these sheets directly when available. Include direct links. If a topic is not in the followed sheets, provide a general explanation.

3. If the user asks for their progress:
- Use the email "${email || 'Ask the user'}" to fetch progress from the backend.
- If no email is found, politely ask the user to provide it.
- Summarize how many problems have been completed, remaining, and current position in each followed sheet.

4. Be helpful, concise, friendly, and beginner supportive. Never make up data.

The input is: "${input}"

${progressData ? `\n${progressData}` : ""}
`;

    try {
      const res = await fetch(RELEVANCE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: RELEVANCE_API_KEY,
        },
        body: JSON.stringify({
          input: finalPrompt,
        }),
      });
      console.log(res)
      const data = await res.json();
      console.log(data)
      const aiReply = {
        role: "assistant",
        content: data?.result?.output || "Sorry, I couldn't fetch a response.",
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response from AI." },
      ]);
    }
  };

  return (
    <div className="p-6 bg-[#1E1E2E] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Ask DSA AI Assistant</h1>
      <div className="bg-[#2C2F48] rounded-lg p-4 max-w-2xl mx-auto space-y-3 h-[400px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "user" ? "text-blue-300" : "text-green-400"
            }`}
          >
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a topic or your progress..."
          className="flex-1 p-2 rounded bg-[#2C2F48] text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {!email && (
        <div className="max-w-2xl mx-auto mt-4 text-yellow-400">
          We couldn't find your email in localStorage. Please provide your
          registered email to fetch your progress.
        </div>
      )}
    </div>
  );
};

export default AIChatAgent;
