import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Career Assistant endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { question, profile, history = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent mock fallback if API key is not yet configured
      return res.json({
        reply: generateLocalAssistantReply(question, profile),
        mode: "local_assistant",
      });
    }

    const systemPrompt = `You are the SkillMatch AI Career Assistant, deeply embedded inside the SkillMatch platform.
The student is:
Name: ${profile?.name || "Student"}
Course/Branch: ${profile?.course || "Engineering"}
Year: ${profile?.year || "3rd Year"}
Skills: ${Array.isArray(profile?.skills) ? profile.skills.join(", ") : profile?.skills || "Python, React"}
Interests: ${Array.isArray(profile?.interests) ? profile.interests.join(", ") : profile?.interests || "AI, Hackathons"}
Career Goal: ${profile?.careerGoal || "AI/ML Engineer"}
Profile Strength: ${profile?.profileStrength || "82%"}
Career Readiness Score: ${profile?.careerReadiness || "76/100"}
Recent Activity: Participated in AI Hackathon, applied to Python Internship, completed ML Workshop.

Always provide tailored, actionable advice referencing their specific profile data, skills, and current market hackathons/internships. Keep responses well-structured, warm, encouraging, concise (2-3 short paragraphs or bullet points). Avoid generic fluff.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const response = await chat.sendMessage({
      message: question || "How can I improve my profile for AI internships?",
    });

    res.json({
      reply: response.text || generateLocalAssistantReply(question, profile),
      mode: "gemini",
    });
  } catch (error: any) {
    console.error("Gemini Career Assistant error:", error);
    res.json({
      reply: generateLocalAssistantReply(req.body?.question, req.body?.profile),
      mode: "local_fallback",
      error: error?.message,
    });
  }
});

// 3. AI Resume Analysis
app.post("/api/ai/analyze-resume", async (req, res) => {
  try {
    const { resumeText, studentName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getLocalResumeAnalysis(resumeText, studentName));
    }

    const prompt = `Analyze this student's resume or background profile summary. Extract detected skills, detected interests, detected experience, estimated profile strength (between 70% and 95%), career readiness breakdown, and a tailored AI recommendation.
Candidate Name: ${studentName || "Candidate"}
Resume text/summary:
"${resumeText || "Computer Science student with experience in Python, Machine Learning basics, React web development, GitHub projects, and hackathon participation."}"

Return strictly a JSON object with this shape:
{
  "detectedSkills": ["string"],
  "detectedInterests": ["string"],
  "detectedExperience": ["string"],
  "careerGoal": "string",
  "profileStrength": number,
  "careerReadiness": number,
  "readinessBreakdown": {
    "skills": number,
    "projects": number,
    "experience": number,
    "participation": number,
    "profileCompleteness": number
  },
  "recommendation": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch {
      data = getLocalResumeAnalysis(resumeText, studentName);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    res.json(getLocalResumeAnalysis(req.body?.resumeText, req.body?.studentName));
  }
});

// 4. AI Opportunity extraction for Organizers
app.post("/api/ai/extract-opportunity", async (req, res) => {
  try {
    const { description } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getLocalOpportunityExtraction(description));
    }

    const prompt = `You are SkillMatch AI's event extraction engine for organizers.
Analyze this opportunity description and extract structured fields:
- title: concise title
- type: "Hackathon" | "Internship" | "Workshop" | "Competition" | "Scholarship"
- requiredSkills: array of 3-6 specific tech skills
- eligibility: student eligibility summary
- estimatedAudience: { "potential": number, "highlyRelevant": number, "recommendedNotification": number }
- summary: 1-sentence teaser

Description:
"${description}"

Return strictly a JSON object matching that structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch {
      data = getLocalOpportunityExtraction(description);
    }

    res.json(data);
  } catch (error) {
    res.json(getLocalOpportunityExtraction(req.body?.description));
  }
});

// Local Fallback Helpers
function generateLocalAssistantReply(question: string = "", profile: any): string {
  const q = question.toLowerCase();
  const name = profile?.name?.split(" ")[0] || "there";
  const skills = Array.isArray(profile?.skills) ? profile.skills.join(", ") : (profile?.skills || "Python, React");

  if (q.includes("apply") || q.includes("opportunity") || q.includes("opportunities")) {
    return `Hey ${name}! Based on your current stack (${skills}), your top match right now is the **AI/ML Hackathon** (94% match) and the **Python Internship** (89% match). 

I suggest applying to the AI/ML Hackathon first—your skills in Python and ML cover the primary tracks, and you can use **TeamMatch** to pair up with a React/UI frontend teammate to complete your squad.`;
  }

  if (q.includes("missing") || q.includes("internship") || q.includes("internships")) {
    return `Looking at Tier-1 AI/ML internships on SkillMatch, you have solid foundation in Python & basic ML (82%). 

The key missing skills are **Model Deployment (FastAPI/Docker)** and **Vector DBs / RAG tooling (LangChain/Chroma)**. Adding a lightweight deployed demo project onto your GitHub will bridge your gap from 89% to 98% compatibility.`;
  }

  if (q.includes("improve") || q.includes("profile")) {
    return `To boost your Profile Strength from **${profile?.profileStrength || "82%"}** to **95%+**:
1. **Deploy one live project link** (adds +8% completeness).
2. **Add verifiable GitHub repo link** to your completed hackathon prototype.
3. **Earn the '10 Applications' or '5 Projects' badge** in your Growth Dashboard.`;
  }

  if (q.includes("project") || q.includes("suggest")) {
    return `Here is a high-impact project idea tailored to your profile:
**"Autonomous Skill-Gap Matcher & Resume Critic"**
- **Stack**: Python, FastAPI, HuggingFace embeddings, React frontend.
- **Why it strengthens your profile**: Demonstrates end-to-end fullstack AI engineering, real-world utility, and addresses both your Python/ML strengths and your frontend skills.`;
  }

  return `Hey ${name}! Based on your current SkillMatch profile (${skills}), you have strong momentum with an 82% profile strength. You're particularly well-positioned for AI hackathons and entry Python roles. Would you like me to suggest specific skill-gap steps to reach 100% match, or find a complementary hackathon teammate?`;
}

function getLocalResumeAnalysis(resumeText: string = "", studentName: string = "Rahul Sharma") {
  const isML = /ml|machine learning|ai|python/i.test(resumeText);
  return {
    detectedSkills: isML
      ? ["Python", "Machine Learning", "Git", "SQL", "React", "Pandas", "Scikit-Learn"]
      : ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git", "Node.js"],
    detectedInterests: ["Generative AI", "Hackathons", "Full-Stack Development", "Open Source"],
    detectedExperience: [
      "Built 'SmartAttend' face-recognition college project",
      "Core Tech Member in Campus Google Developer Student Club",
      "Participant in Smart India Hackathon 2025 (Top 10 Finalist)",
    ],
    careerGoal: "AI/ML Software Engineer",
    profileStrength: 84,
    careerReadiness: 76,
    readinessBreakdown: {
      skills: 82,
      projects: 71,
      experience: 65,
      participation: 80,
      profileCompleteness: 90,
    },
    recommendation:
      "Build one deployed AI project and participate in a team-based hackathon to strengthen your profile.",
  };
}

function getLocalOpportunityExtraction(text: string = "") {
  const lower = text.toLowerCase();
  const isHackathon = lower.includes("hackathon");
  const isInternship = lower.includes("intern") || lower.includes("role");
  const isWorkshop = lower.includes("workshop") || lower.includes("bootcamp");

  const type = isHackathon ? "Hackathon" : isInternship ? "Internship" : isWorkshop ? "Workshop" : "Competition";

  let skills = ["Python", "Machine Learning", "Git"];
  if (lower.includes("react") || lower.includes("web") || lower.includes("frontend")) {
    skills = ["React", "TypeScript", "Tailwind CSS", "Git"];
  } else if (lower.includes("data") || lower.includes("analytics")) {
    skills = ["Python", "SQL", "Machine Learning", "Tableau"];
  }

  return {
    title: isHackathon
      ? "AI & Robotics National Hackathon"
      : isInternship
      ? "AI/Python Engineering Internship"
      : "Generative AI Masterclass",
    type,
    requiredSkills: skills,
    eligibility: lower.includes("undergrad") ? "Undergraduate students, any year" : "Open to all enrolled students",
    estimatedAudience: {
      potential: 382,
      highlyRelevant: 96,
      recommendedNotification: 96,
    },
    summary: text.slice(0, 120) + (text.length > 120 ? "..." : ""),
  };
}

// Vite middleware / production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillMatch AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
