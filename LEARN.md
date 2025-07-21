# 🎓 LEARN.md – Deep Dive into Contest\_OnlineJudge ( CodeArena )

A complete learning guide for the **CodeArena- The Real OJ** project by **kanikaa‑3018**, featuring MERN stack components, sandboxed compilation, automation workflows, and an internship-tracking extension.

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Folder & Module Structure](#folder--module-structure)
4. [Server: Routes & Models Deep Dive](#server-routes--models-deep-dive)
5. [Client: Frontend Flow](#client-frontend-flow)
6. [Compiler Server](#compiler-server)
7. [Agent Workflows (n8n)](#agent-workflows-n8n)
8. [Chrome Extension: Internship Tracker](#chrome-extension-internship-tracker)
9. [Key Programming Concepts](#key-programming-concepts)
10. [Patterns & Best Practices](#patterns--best-practices)
11. [How to Extend](#how-to-extend)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Learning Path for Beginners](#learning-path-for-beginners)
14. [Contributing to the Project](#contributing-to-the-project)

---

## 🎯 Project Overview

**Contest\_OnlineJudge** is a full-stack web app with these key features:

* **MERN stack**: MongoDB, Express, React, Node.js
* **Language sandbox**: `compiler-server` handles secure code compilation/execution
* **Automation**: `agent-workflows` powered by n8n to orchestrate tasks (e.g., scheduling contests, processing results)
* **Chrome extension**: Tracks internship applications and deadlines
* **User-facing features**: Problem submission, real-time judging, live scoreboards, contests

---

## 🏗️ Architecture & Design

### Design Philosophy

* **Separation of Concerns**:

  * Server (API logic)
  * Client (UI/UX)
  * Compiler Server (sandboxed execution)
  * Agent workflows (background tasks, scheduling)
  * Chrome extension (client-side tracking)

* **MVC-inspired layout**:

  * **Models** in server for data representation
  * **Routes** in server for API endpoints
  * **Client** uses React components for View + Controller
  * **Compiler-server**: pure logic for secure code execution

---

## 🗂️ Folder & Module Structure

```
contest_onlinejudge/
├── server/                # Express API + MongoDB models
├── client/                # React SPA for contest interface
├── compiler‑server/       # Secure sandbox compilation service
├── agent‑workflows/       # n8n workflows for automated tasks
└── chrome-extension/      # Tracks internships (React + Manifest v3)
```

---

## 🛠️ Server: Routes & Models Deep Dive

### Routes Overview (`server/routes/`):

* **/api/auth/** – Register, login, JWT-based auth flows
* **/api/users/** – User profiles, roles, stats
* **/api/problems/** – CRUD, problem listing, test cases
* **/api/contests/** – Contest creation, join, schedules
* **/api/submissions/** – Submit code → queue → judge results
* **/api/compiler/** (optional) – Proxy calls to compiler-server

### Model Definitions (`server/models/`):

* **User.js**

  ```js
  {
    name, email, passwordHash, role: ['user', 'admin'], submissions: [Submission]
  }
  ```
* **Problem.js**

  ```js
  {
    title, description, timeLimit, memoryLimit,
    testCases: [{ input, output, weight }]
  }
  ```
* **Contest.js**

  ```js
  {
    name, startTime, endTime,
    problems: [ObjectId],
    participants: [User]
  }
  ```
* **Submission.js**

  ```js
  {
    user: ObjectId, problem: ObjectId, language,
    code, status: ['PENDING','RUNNING','AC','WA','TLE','RE'],
    runtime, memory, submittedAt
  }
  ```

---

## 🖥️ Client: Frontend Flow (React)

* **Pages**: Home, Problem view, Contest arena, User Dashboard
* **Components**:

  * `<CodeEditor>` – uses CodeMirror or Monaco
  * `<SubmissionList>` – real-time updates via WebSocket or polling
  * `<Scoreboard>` – contest leaderboard component
* **State mgmt**: Context API or Redux for user/auth and submissions
* **API integration**: Axios calls to server endpoints
* **Routing**: React Router for page flows

---

## 🧠 Compiler Server

* A standalone Node.js or Python microservice
* Accepts POST with `{code, language, testcases}`
* Executes safely in Docker or a sandbox
* Returns verdicts per testcase (+ runtime/memory)
* Called by server via HTTP or message queue

---

## 🔄 Agent Workflows – n8n

In `agent-workflows/`:

* Scheduled workflows (e.g., contest reminders, leaderboard snapshots)
* Submission-processing workflows: moves data from server to compiler and back
* Can send Slack/email notifications on contest events

---

## 🧩 Chrome Extension: Internship Tracker

* Manifest v3 with background script and popup UI
* Track internship: save company, deadline, status
* Storage via `chrome.storage`
* UI showing upcoming deadlines, reminders
* Possible integration with client API for login-sync

---

## 🔑 Key Programming Concepts

1. **API design**: RESTful routes, JWT authentication
2. **Real-time features**: WebSocket/AJAX polling
3. **Secure code execution**: Docker or sandboxed microservice
4. **Asynchronous workflows**: n8n for cron-like tasks
5. **Browser extensions**: Manifest v3, Chrome APIs

---

## 🎨 Patterns & Best Practices

* **Modular code**: Clear separation between services
* **Security**: Use HTTPS, sanitize code, use rate-limits
* **Scalable architecture**: Independent microservices (`compiler-server`, server, workflows)
* **Async job management**: Task queues for submissions
* **Clean UX**: React components with live feedback

---

## 🚀 How to Extend

### Beginner

* Show compile-time errors directly in UI
* Add pagination/filtering for problems and submissions
* Improve internship extension UI or add notifications

### Intermediate

* Support private/public contests
* Implement code plagiarism detection
* Add email reminders for submissions or deadlines

### Advanced

* Full Docker sandbox orchestration
* Multi-language code metrics (e.g. memory graphs)
* ML-based analytics, code insights

---

## 🐛 Troubleshooting Guide

| Symptom                          | Checks                                               |
| -------------------------------- | ---------------------------------------------------- |
| **Auth routes fail**             | Verify JWT secret, token expiry, headers             |
| **Submissions stuck as PENDING** | Check Mongo queue, agent cron, workflows             |
| **Compilation errors hang**      | Inspect compiler-server logs, timeouts               |
| **Scoreboard doesn’t update**    | Verify WebSocket connection, endpoint correctness    |
| **Chromium extension broken**    | Reload unpacked extension, check storage permissions |

---

## 🧩 Learning Path for Beginners

1. **React + REST** – Build UI, authentication, data submission
2. **Node + Express + Mongoose** – Work with models and APIs
3. **Secure code execution** – Docker or sandbox logic
4. **Automation** – Use n8n for cron-like tasks
5. **Browser extension basics** – Manifest v3, storage APIs

---

## 🤝 Contributing to the Project

1. Fork and clone the repo
2. Set up `.env`, MongoDB, n8n and services per instructions
3. Choose an issue labeled `good-first-issue` or propose a feature
4. Write code, add tests, update docs/LEARN.md
5. Submit a PR and iterate based on feedback

---

## 🎉 Conclusion

**Contest\_OnlineJudge** offers a deep dive into full-stack development, automated workflows, sandboxed execution, and browser extension mechanics. It's both a solid educational tool and a real-world application—fix, hack, improve, and let others learn from your journey!🚀

---

*📢 Suggestions or corrections? Feel free to open an issue or submit a PR!*
