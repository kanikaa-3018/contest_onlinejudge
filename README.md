# 🧠 CodeArena🚀

**An AI-Driven Coding, Career & Contest Companion**

> A unified, intelligent platform built with the MERN stack and powered by AI agents using **n8n workflows** and **Relevance AI**, designed for coders, developers, and students to track contests, submit code, and manage internship applications — all under one roof.

---

## 📚 Table of Contents

* [📌 Overview](#-overview)
* [✨ Key Features](#-key-features)

  * [🔁 Real-Time Contest Tracking](#-real-time-contest-tracking)
  * [💻 Online Compiler & Judge (with Docker)](#-online-compiler--judge-with-docker)
  * [🤖 AI Agents (Built with n8n + Relevance AI)](#-ai-agents-built-with-n8n--relevance-ai)
  * [🧳 Internship Tracker + Chrome Extension](#-internship-tracker--chrome-extension)
  * [🛠️ Admin Dashboard](#-admin-dashboard)
* [🎨 UI Snapshots](#-ui-snapshots)
* [🔬 Architecture Overview](#-architecture-overview)
* [🧠 How AI is Used](#-how-ai-is-used)
* [⚙️ Tech Stack](#-tech-stack)
* [🚀 Installation Guide](#-installation-guide)
* [📜 License](#-license)
* [📬 Contact](#-contact)

---

## 📌 Overview

**CodeArena** is a modern, AI-powered web application that combines three major tools into one cohesive system:

1. **Real-time contest tracking**
2. **Built-in code submission and judging**
3. **Internship tracking with smart follow-ups**

This platform uses **n8n-based AI agents** and **Relevance AI** for generating problem hints, evaluating user code, and tracking internships — making it a complete ecosystem for growth in tech.

---

## ✨ Key Features

### 🔁 Real-Time Contest Tracking

* Aggregates live and upcoming contests from **Codeforces, CodeChef, LeetCode**, and more.
* Displays contest calendar with user-specific filters.
* Compares past performance across platforms.

---

### 💻 Online Compiler & Judge (with Docker)

* Secure multi-language code compiler for **C++, Java, Python, JavaScript**, and more.
* Submissions run inside **isolated Docker containers** for maximum safety.
* Verdict system supports custom inputs, standard test cases, and AI-generated edge cases.

---

### 🤖 AI Agents (Built with n8n + Relevance AI)

> ⚡ Powering automation, hints, insights, and reminders

* **n8n Workflows** automate:

  * Contest reminders
  * Internship follow-up nudges
  * Hint generation triggers

* **Relevance AI Integration**:

  * Code analysis: readability, complexity, optimization tips
  * Personalized hint generation for each problem
  * Semantic code similarity analysis for plagiarism checks

---

### 🧳 Internship Tracker + Chrome Extension

* Track applied internships, deadlines, company names, and current status.
* AI agents schedule follow-ups and remind you about interviews.
* A custom **Chrome Extension** lets users **auto-save internship listings** from job portals like **LinkedIn**, **Internshala**, etc.

---

### 🛠️ Admin Dashboard

* Add, edit, and manage coding questions.
* Auto-generate test cases using Relevance AI.
* Review user submissions and performance insights.
* Manage contests, problems, and announcements.

---

## 🎨 UI Snapshots

> *(Screenshots Coming Soon)*
> The platform features a **clean, fast, responsive interface** built with **TailwindCSS**, providing an intuitive experience on both desktop and mobile.

---

## 🔬 Architecture Overview

```plaintext
User ↔ Frontend (React + Tailwind) ↔ Backend (Express + Node)
       ↘                            ↙
      AI Agent Engine (n8n + Relevance AI)
           ↘         ↙
     MongoDB         Dockerized Judge Engine
```

---

## 🧠 How AI is Used

| AI Feature                   | Powered By                 | Description                                               |
| ---------------------------- | -------------------------- | --------------------------------------------------------- |
| 🧠 Code Hint Generation      | Relevance AI + n8n         | Generates contextual hints per problem and code state     |
| 🔍 Code Feedback & Analysis  | Gemini AI                  | Reviews code for quality, performance, and best practices |
| 🧪 Test Case Generation      | n8n + Open AI models       | Creates comprehensive and edge case test sets             |
| 📆 Internship Reminders      | n8n + chrome extension     | Sends alerts based on deadlines, stages, and follow-ups   |
| 🤖 Chat-based Interview Prep | Relevance AI               | Suggests questions & tips based on internship data        |
| ⚠️ Plagiarism Detection      | Relevance AI + Semantic AI | Compares solutions semantically across users              |

---

## ⚙️ Tech Stack

| Layer       | Tech                                          |
| ----------- | ------------------------------                |
| Frontend    | React.js, TailwindCSS                         |
| Backend     | Node.js, Express.js                           |
| Database    | MongoDB                                       |
| Compiler    | Docker, Custom Judge API, Monacco Editor      |
| Automation  | n8n (Self-hosted or cloud)                    |
| AI Platform | Relevance AI                                  |
| Extensions  | Chrome Extension (Manifest V3)                |  

---

## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/kanikaa-3018/contest_onlinejudge.git
cd contest_onlinejudge
```

### 2. Set Up Environment Variables

Create a `.env` file in both `/server` and `/client`:

```env
# server/.env
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_openai_key
RELEVANCE_AI_KEY=your_relevance_ai_key
```

```env
#client/.env
CF_API_KEY=your_codeforces_api_key
CF_SECRET=your_codeforces_secret
VITE_RELEVANCE_AI_KEY=your_relevance_ai_key
```

### 3. Install Backend & Frontend Dependencies

```bash
cd server
npm install
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm start
```

### 4. (Recommended) Run with Docker

Make sure Docker is installed and running:

```bash
docker-compose up --build
```

> This will spin up the entire backend, including the **secure judge engine in containers**.

### 5. n8n Setup (AI Agents & Automation)
You can self-host or use n8n Cloud to power AI automation workflows for:

🧠 Hint generation
🧳 Internship follow-ups
📊 Code quality review
📅 Contest reminders

🖼 Screenshot and workflow link will be added here:

📥 View n8n Workflow JSON (coming soon)

(coming soon)


---

## 📜 License

This project is licensed under the **MIT License**.
Feel free to fork, enhance, and contribute to the project!

---

## 📬 Contact

**Kanika Singhal**
🚀 Full Stack Developer | AI Explorer
🌐 GitHub: [kanikasinghal](https://github.com/kanikaa-3018)
📧 Email: [kanikasinghal.dev@example.com](mailto:kanikasin216@gmail.com)

