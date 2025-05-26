const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
function analyzeResumeLocally(resumeText) {
  const text = resumeText.toLowerCase();
  const lines = resumeText.split("\n").filter((line) => line.trim());

  // Contact Information Analysis
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone =
    /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(text);
  const hasLinkedIn = text.includes("linkedin") || text.includes("linked.in");
  const hasLocation =
    /\b(city|state|location|address|zip|postal)\b/.test(text) ||
    /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(resumeText);

  // Professional Summary Analysis
  const summaryKeywords = ["summary", "objective", "profile", "about"];
  const hasSummary = summaryKeywords.some((keyword) => text.includes(keyword));
  const summarySection = extractSection(resumeText, summaryKeywords);
  const summaryWordCount = summarySection
    ? summarySection.split(" ").length
    : 0;

  // Skills Detection
  const commonSkills = [
    "javascript",
    "python",
    "java",
    "react",
    "node.js",
    "angular",
    "vue",
    "html",
    "css",
    "sql",
    "mongodb",
    "postgresql",
    "aws",
    "docker",
    "git",
    "project management",
    "leadership",
    "communication",
    "marketing",
    "sales",
    "data analysis",
    "machine learning",
    "artificial intelligence",
    "excel",
    "powerpoint",
    "photoshop",
    "illustrator",
    "figma",
    "sketch",
  ];

  const detectedSkills = commonSkills.filter((skill) => text.includes(skill));

  // Experience Analysis
  const experienceKeywords = [
    "experience",
    "employment",
    "work history",
    "career",
  ];
  const hasExperience = experienceKeywords.some((keyword) =>
    text.includes(keyword)
  );
  const yearsMatch = text.match(/(\d+)\+?\s*years?/);
  const yearsOfExperience = yearsMatch
    ? parseInt(yearsMatch[1])
    : estimateExperienceFromContent(resumeText);

  // Achievement Detection
  const achievementPatterns = [
    /\d+%/,
    /\$\d+/,
    /increased?.*\d+/,
    /improved?.*\d+/,
    /reduced?.*\d+/,
    /grew.*\d+/,
    /managed.*\d+/,
    /led.*\d+/,
    /achieved.*\d+/,
  ];
  const hasQuantifiedAchievements = achievementPatterns.some((pattern) =>
    pattern.test(text)
  );

  // ATS Score Calculation
  let atsScore = 0;
  if (hasEmail) atsScore += 15;
  if (hasPhone) atsScore += 10;
  if (hasLinkedIn) atsScore += 10;
  if (hasSummary) atsScore += 15;
  if (detectedSkills.length > 5) atsScore += 20;
  if (hasQuantifiedAchievements) atsScore += 15;
  if (hasExperience) atsScore += 15;

  // Keyword Score
  const keywordScore = Math.min(
    100,
    detectedSkills.length * 8 + (hasQuantifiedAchievements ? 20 : 0)
  );

  // Format Score
  let formatScore = 70; // Base score
  if (lines.length > 20) formatScore += 10; // Good length
  if (hasEmail && hasPhone) formatScore += 10; // Complete contact
  if (hasSummary) formatScore += 10; // Has summary

  // Generate job matches based on detected skills
  const jobMatches = generateJobMatches(detectedSkills, yearsOfExperience);

  // Generate suggestions
  const suggestions = generateSuggestions(
    detectedSkills,
    hasQuantifiedAchievements,
    hasSummary
  );

  return {
    atsScore: Math.min(100, atsScore),
    keywordScore: Math.min(100, keywordScore),
    formatScore: Math.min(100, formatScore),
    overallAssessment: generateOverallAssessment(
      atsScore,
      keywordScore,
      formatScore
    ),
    contactInfo: {
      hasPhone,
      hasEmail,
      hasLinkedIn,
      hasLocation,
    },
    professionalSummary: {
      present: hasSummary,
      wordCount: summaryWordCount,
      hasQuantifiableAchievements: hasSummary && hasQuantifiedAchievements,
      hasIndustryKeywords: detectedSkills.length > 3,
      status: getSectionStatus(
        hasSummary,
        summaryWordCount > 30,
        detectedSkills.length > 3
      ),
    },
    workExperience: {
      yearsOfExperience,
      hasProgression: hasCareerProgression(resumeText),
      hasQuantifiedAchievements,
      isRelevant: detectedSkills.length > 2,
      status: getSectionStatus(
        hasExperience,
        hasQuantifiedAchievements,
        yearsOfExperience > 1
      ),
    },
    skills: {
      detectedSkills: detectedSkills.slice(0, 15), // Limit to top 15
      suggestedSkills: getSuggestedSkills(detectedSkills),
      status: getSectionStatus(
        detectedSkills.length > 5,
        detectedSkills.length > 10,
        true
      ),
    },
    jobMatches,
    suggestions,
  };
}

function extractSection(text, keywords) {
  const lines = text.split("\n");
  let inSection = false;
  let section = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (keywords.some((keyword) => line.includes(keyword))) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (
        line.trim() === "" &&
        lines[i + 1]?.toLowerCase().match(/^[a-z\s]+:?$/)
      ) {
        break; // Next section started
      }
      section += lines[i] + " ";
    }
  }

  return section.trim() || null;
}

function estimateExperienceFromContent(text) {
  const years = text.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/gi);
  if (!years) return 0;

  let totalYears = 0;
  years.forEach((yearRange) => {
    const match = yearRange.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
    if (match) {
      const startYear = parseInt(match[1]);
      const endYear =
        match[2].toLowerCase().includes("present") ||
        match[2].toLowerCase().includes("current")
          ? new Date().getFullYear()
          : parseInt(match[2]);
      totalYears += endYear - startYear;
    }
  });

  return Math.max(0, totalYears);
}

function hasCareerProgression(text) {
  const progressionWords = [
    "senior",
    "lead",
    "manager",
    "director",
    "promoted",
    "advanced",
  ];
  return progressionWords.some((word) => text.toLowerCase().includes(word));
}

function getSectionStatus(good, better, best) {
  if (best && better && good) return "excellent";
  if (good && better) return "good";
  return "needs_improvement";
}

function getSuggestedSkills(detectedSkills) {
  const suggestions = [];

  // Suggest complementary skills
  if (detectedSkills.includes("react")) {
    suggestions.push("typescript", "redux", "next.js");
  }
  if (detectedSkills.includes("python")) {
    suggestions.push("django", "flask", "pandas");
  }
  if (detectedSkills.includes("javascript")) {
    suggestions.push("typescript", "webpack", "babel");
  }

  // Add some general suggestions
  if (
    !detectedSkills.some((skill) =>
      ["project management", "leadership"].includes(skill)
    )
  ) {
    suggestions.push("project management", "leadership");
  }

  return suggestions.slice(0, 5);
}

function generateJobMatches(skills, experience) {
  const jobTemplates = [
    {
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      baseMatch: 85,
      salary: "$75,000 - $120,000",
      location: "San Francisco, CA",
      description:
        "Join our dynamic team to build scalable web applications using modern technologies.",
      requirements: ["JavaScript", "React", "Node.js", "Git"],
      skillsNeeded: ["javascript", "react", "node.js"],
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency Pro",
      baseMatch: 80,
      salary: "$60,000 - $95,000",
      location: "Austin, TX",
      description:
        "Create beautiful and responsive user interfaces for web applications.",
      requirements: ["HTML", "CSS", "JavaScript", "React/Vue/Angular"],
      skillsNeeded: ["html", "css", "javascript", "react"],
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      baseMatch: 75,
      salary: "$70,000 - $110,000",
      location: "Remote",
      description:
        "Work on both frontend and backend development in a fast-paced startup environment.",
      requirements: [
        "JavaScript",
        "Python/Node.js",
        "Database",
        "API Development",
      ],
      skillsNeeded: ["javascript", "python", "sql"],
    },
    {
      title: "Data Analyst",
      company: "Data Insights Corp",
      baseMatch: 70,
      salary: "$55,000 - $85,000",
      location: "New York, NY",
      description:
        "Analyze complex datasets to provide business insights and recommendations.",
      requirements: ["SQL", "Excel", "Python/R", "Data Visualization"],
      skillsNeeded: ["sql", "python", "excel"],
    },
    {
      title: "Project Manager",
      company: "Enterprise Solutions",
      baseMatch: 65,
      salary: "$65,000 - $100,000",
      location: "Chicago, IL",
      description:
        "Lead cross-functional teams to deliver projects on time and within budget.",
      requirements: [
        "Project Management",
        "Agile",
        "Leadership",
        "Communication",
      ],
      skillsNeeded: ["project management", "leadership"],
    },
  ];

  return jobTemplates
    .map((template) => {
      const skillMatch = template.skillsNeeded.filter((skill) =>
        skills.includes(skill)
      ).length;
      const matchScore = Math.min(
        100,
        template.baseMatch + skillMatch * 5 - Math.max(0, (experience - 5) * 2)
      );

      return {
        title: template.title,
        company: template.company,
        matchScore: Math.max(60, matchScore),
        salary: template.salary,
        location: template.location,
        description: template.description,
        requirements: template.requirements,
        remote: template.location === "Remote",
        fullTime: true,
        experienceLevel:
          experience < 2
            ? "Entry Level"
            : experience < 5
            ? "Mid Level"
            : "Senior Level",
        postedDays: Math.floor(Math.random() * 14) + 1,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

function generateSuggestions(skills, hasAchievements, hasSummary) {
  const improvements = [];
  const keywordOptimization = [];
  const formatRecommendations = [];

  if (!hasSummary) {
    improvements.push("Add a professional summary at the top of your resume");
  }

  if (!hasAchievements) {
    improvements.push(
      "Include quantifiable achievements (percentages, dollar amounts, numbers)"
    );
  }

  if (skills.length < 5) {
    improvements.push(
      "Add more relevant technical skills to your skills section"
    );
  }

  keywordOptimization.push(
    "Include industry-specific keywords relevant to your target role"
  );
  keywordOptimization.push(
    'Use action verbs like "achieved", "implemented", "led", "optimized"'
  );
  keywordOptimization.push(
    "Match keywords from job descriptions you're applying to"
  );

  formatRecommendations.push(
    "Use consistent formatting throughout the document"
  );
  formatRecommendations.push("Keep your resume to 1-2 pages maximum");
  formatRecommendations.push("Use bullet points for easy scanning");
  formatRecommendations.push(
    "Ensure your contact information is clearly visible at the top"
  );

  return {
    improvements,
    keywordOptimization,
    formatRecommendations,
  };
}

function generateOverallAssessment(atsScore, keywordScore, formatScore) {
  const avgScore = (atsScore + keywordScore + formatScore) / 3;

  if (avgScore >= 85) {
    return "Excellent resume! Your resume shows strong ATS compatibility and should perform well in applicant tracking systems. Consider minor tweaks to optimize for specific job applications.";
  } else if (avgScore >= 70) {
    return "Good resume with solid fundamentals. There are opportunities to improve ATS compatibility and keyword optimization to increase your chances of getting past initial screening.";
  } else {
    return "Your resume needs improvement to be competitive in today's job market. Focus on adding quantifiable achievements, relevant keywords, and ensuring proper formatting for ATS systems.";
  }
}

// async function analyzeResumeWithAI(resumeText) {
//   try {
//     const prompt = `
//     I will provide you with a resume text. I want you to analyze it and return the following:

//     1. **Top Skills**: List the top skills of the person based on the resume.
//     2. **Summary**: A 3-4 line professional summary based on the resume.
//     3. **Experience Analysis**: Evaluate the candidate's work experience and impact.
//     4. **Suggestions for Improvement**: Suggest improvements to the resume in bullet points.
//     5. **Suitable Job Roles**: Based on the resume, list 5 suitable job roles.

//     Here is the resume:
//     """${resumeText}"""

//     Please return your response in the following JSON format:
//     {
//       "topSkills": ["Skill1", "Skill2", "Skill3", ...],
//       "summary": "Professional summary here.",
//       "experienceAnalysis": "Brief analysis here.",
//       "suggestions": ["Suggestion 1", "Suggestion 2", ...],
//       "jobRoles": ["Role 1", "Role 2", ...]
//     }
//         `.trim();

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [
//                 {
//                   text: prompt,
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     if (data.candidates && data.candidates.length > 0) {
//         console.log("gemini did it")
//       res.json({ feedback: data.candidates[0].content.parts[0].text });
//     } else {
//       console.error("No candidates in response:", JSON.stringify(data));
//       res
//         .status(500)
//         .json({ message: "Gemini did not return valid response." });
//     }

//     // const completion = await openai.chat.completions.create({
//     //   model: "gpt-3.5-turbo",
//     //   messages: [
//     //     {
//     //       role: "system",
//     //       content: "You are a professional resume analyst and career expert.",
//     //     },
//     //     {
//     //       role: "user",
//     //       content: prompt,
//     //     },
//     //   ],
//     //   temperature: 0.7,
//     // });

//     // const aiResponse = completion.choices[0].message.content;
//     // const parsed = JSON.parse(aiResponse);
//     // console.log(parsed)

//     const analysis = analyzeResumeLocally(resumeText);
//     return analysis;
//   } catch (error) {
//     console.error("OpenAI Resume Analysis Error:", error.message);
//     throw new Error("Failed to analyze resume using AI");
//   }
// }

async function analyzeResumeWithAI(resumeText) {
  console.log(resumeText)
  try {
    const prompt = `
  Analyze and scrape the following resume text and find out the given options below and return a JSON object strictly matching this structure:

{
  "fileName": "string - the name of the resume file",
  "createdAt": "string - ISO8601 timestamp of analysis date/time",
  "atsScore": number (0-100),
  "keywordScore": number (0-100),
  "formatScore": number (0-100),
  "overallAssessment": "string - a concise summary of the resume quality",

  "contactInfo": {
    "hasPhone": boolean,
    "hasEmail": boolean,
    "hasLinkedIn": boolean,
    "hasLocation": boolean
  },

  "professionalSummary": {
    "status": "string - presence or quality indicator (e.g. 'Present', 'Missing')",
    "wordCount": number,
    "hasQuantifiableAchievements": boolean,
    "hasIndustryKeywords": boolean
  },

  "workExperience": {
    "yearsOfExperience": number,
    "status": "string - quality or presence indicator",
    "hasProgression": boolean,
    "hasQuantifiedAchievements": boolean,
    "isRelevant": boolean
  },

  "skills": {
    "status": "string - quality or presence indicator",
    "detectedSkills": ["array of detected skill strings"],
    "suggestedSkills": ["array of suggested skill strings"]
  },

  "suggestions": {
    "improvements": ["array of improvement suggestion strings"],
    "keywordOptimization": ["array of keyword optimization suggestion strings"],
    "formatRecommendations": ["array of format recommendation strings"]
  }
}
Also, return a jobMatches array containing 5–7 recommended job roles that suit the candidate’s resume.
Each job object should include:

title (e.g., "Full Stack Developer")

company (e.g., "Techify Solutions")

matchScore (a percentage match score, e.g., 87)

salary (e.g., "₹12–15 LPA" or "Negotiable")

remote (boolean)

fullTime (boolean)

experienceLevel (e.g., "Mid-Level", "Entry-Level")

description (1–2 line summary)

location (e.g., "Remote", "Bangalore")

postedDays (number of days ago the job was posted, e.g., 3)

Do not include any text outside the JSON object. Use true/false for booleans and ISO 8601 format for the date. Provide realistic and actionable data based on the resume content.
  
  Here is the resume:
  """${resumeText}"""
  
      `.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const rawText = data.candidates[0].content.parts[0].text;

      // Try to parse JSON even if it's wrapped in code blocks
      const clean = rawText
        .replace(/```json\n?|```/g, "") // remove code block markers
        .trim();
    //   console.log(clean);
      try {
        const parsed = JSON.parse(clean);
        console.log(parsed);
        return parsed;
      } catch (err) {
        console.warn("Gemini did not return strict JSON. Returning raw text.");
        return { raw: rawText };
      }
    } else {
      console.error("No candidates in response:", JSON.stringify(data));
      throw new Error("Gemini did not return a valid response.");
    }
  } catch (error) {
    console.error("Gemini Resume Analysis Error:", error.message);
    throw new Error("Failed to analyze resume using Gemini");
  }
}

module.exports = {
  analyzeResumeWithAI,
  analyzeResumeLocally,
};
