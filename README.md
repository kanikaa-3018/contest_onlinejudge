
# 🧠 CodeArena 🚀

**Your AI-First Platform for Coding, Collaboration & Career Growth**

> **CodeArena** is a cutting-edge, AI-powered ecosystem architected with a **microservices-based MERN stack**, combining **Dockerized online judging**, **AI-integrated collaboration tools**, and **smart career utilities**.
> With intelligent workflows powered by **n8n** and **Relevance AI**, CodeArena is more than a platform — it's your **real-time coding and career companion**.

## 🔍 Why CodeArena?
Unlike traditional coding platforms, CodeArena isn't just a judge or tracker — it's your **interactive AI coding companion**. Whether you’re preparing for coding contests, applying to internships, or looking for intelligent feedback on your code, CodeArena leverages the power of automation and LLMs to guide, evaluate, and elevate your journey in tech.

---


## 🎥 Demo Video

Watch CodeArena in action!
[Demo Video](https://www.loom.com/share/df64a378b64e4400bc89a02bb458a750?sid=1c9e77c5-4ce5-4f33-a475-ef5e375cb118)


---

## 🌐 Deployed Links

* **Frontend:** [https://contest-onlinejudge.vercel.app](https://contest-onlinejudge.vercel.app/)
* **Backend API:** [https://codearena-1f1w.onrender.com](https://codearena-1f1w.onrender.com)
* **Chrome Extension (Internship Tracker):** Available on [Chrome Web Store]

## 📚 Table of Contents

* [📌 Overview](#-overview)
* [✨ Key Features](#-key-features)

  * [🔁 Real-Time Contest Tracking](#-real-time-contest-tracking)
  * [💻 Online Compiler & Judge (with Docker)](#-online-compiler--judge-with-docker)
  * [🤖 AI Agents (Built with n8n + Relevance AI)](#-ai-agents-built-with-n8n--relevance-ai)
  * [🤝 Real-Time Collaborative Rooms](#-real-time-collaborative-rooms)
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

### 🤝 Real-Time Collaborative Rooms

* Interactive Peer Rooms for collaborative coding and learning
* Shared live document editor for notes and problem statements
* Synchronized code editor to write and debug code together
* Integrated chatbox with voice assistance for seamless communication
* Ideal for pair programming, study groups, and real-time contest collaboration

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

## Demo Video
https://github.com/user-attachments/assets/16276e7f-6e64-481a-ae61-a4f2be6a2fb3


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
BACKEND_URL=your_backend_url
COMPILER_BACKEND_URL=your_compilerserver_url
```

```env
#client/.env
CF_API_KEY=your_codeforces_api_key
CF_SECRET=your_codeforces_secret
VITE_RELEVANCE_AI_KEY=your_relevance_ai_key
VITE_BACKEND_URL=your_backend_url
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
npm run dev
```

In another terminal:

```bash
cd compiler-server
npm install
npm run dev
```

### 4. (Recommended) Run with Docker

Make sure Docker is installed and running:

```bash
docker-compose up --build
```

> This will spin up the entire backend, including the **secure judge engine in containers**.



 ### 5. Set Up Chrome Extension (Internship Tracker)

The **Chrome Extension** helps you auto-save internship listings from job portals like LinkedIn, Internshala, etc.

To install it locally:

1. Open **Chrome** and go to `chrome://extensions/`.
2. Enable **Developer Mode** (top right).
3. Click **"Load unpacked"**.
4. Navigate to and select the `/chrome-extension` folder in your cloned repo.
5. The extension will now be available in your browser.
6. Open any internship/job portal and use the extension to **save listings directly** into your Internship Tracker dashboard.

> Make sure the backend server is running so the extension can post data properly.



### 6. n8n Setup (AI Agents & Automation)
You can self-host or use n8n Cloud to power AI automation workflows for:

🧠 Hint generation

![Screenshot 2025-05-23 142759](https://github.com/user-attachments/assets/791d09f5-a128-4b77-9939-2ad8d2c87350)

🧳 Internship follow-ups

![Screenshot 2025-05-23 142400](https://github.com/user-attachments/assets/f10f3722-e669-4644-8ffc-2ac9c2ace376)

📊 Daily Progress summary generator

![Screenshot 2025-05-23 142614](https://github.com/user-attachments/assets/5d7fd372-458f-4cb7-ad61-716a87258f4e)

📅 RealTime chatbot for queries using Relevance AI


### 🔁 📥 View and Download n8n Workflow JSON

You can directly download and import the following n8n workflows into your own workspace.

> ⚠️ **Note:** Make sure to **update the Webhook Trigger node** in each workflow with the correct URL from your own [n8n instance](https://n8n.io). Webhook URLs are unique per workspace.

* [ Download n8n Hint Generator JSON](./agent_workflows/HINT_GENERATOR.json)
  *(Generates AI hints and feedback on user code submissions)*

* [ Download n8n Internship Tracker JSON](./agent_workflows/INTERNSHIP_TRACKER.json)
  *(Tracks internships and sends follow-up reminders via AI agent)*

* [ Download n8n Report Analyzer JSON](./agent_workflows/DAILY_REPORT_ANALYZER.json)
  *(Summarizes contest performance, weaknesses, and submits AI reports)*

---

## 📜 License

This project is licensed under the **MIT License**.
Feel free to fork, enhance, and contribute to the project!

---

## 📬 Contact

**Kanika Singhal**
🚀 Full Stack Developer | AI Explorer
🌐 GitHub: [kanikasinghal](https://github.com/kanikaa-3018)
📧 Email: [kanikasin216@gmail.com](mailto:kanikasin216@gmail.com)


<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>






