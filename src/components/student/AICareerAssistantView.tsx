import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";
import { StudentProfile, ChatMessage } from "../../types";

interface AICareerAssistantViewProps {
  profile: StudentProfile;
}

export const AICareerAssistantView: React.FC<AICareerAssistantViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "assistant",
      text: `Hello ${profile.name.split(" ")[0]}! I am your personal SkillMatch AI Career Assistant. 

I have full context of your profile (${profile.skills.slice(0, 4).join(", ")}), your 82% profile strength, and current hackathons and internships on the platform. What would you like to explore today?`,
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // The 4 specific prompt queries from the user request:
  const quickPrompts = [
    "What opportunities should I apply for?",
    "What skills am I missing for AI internships?",
    "How can I improve my profile?",
    "Suggest a project that will strengthen my profile.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          profile: profile,
        }),
      });

      const data = await res.json();
      const reply = data.reply || getLocalFallback(query, profile);

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const fallbackReply = getLocalFallback(query, profile);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallback = (q: string, p: StudentProfile) => {
    const lower = q.toLowerCase();
    const name = p.name.split(" ")[0];
    if (lower.includes("opportunities") || lower.includes("apply")) {
      return `Based on your profile (${p.skills.slice(0, 3).join(", ")}) and 82% profile strength, you are in prime shape for:
1. **AI/ML Hackathon 2026 (94% match)** — Your Python & PyTorch background directly aligns. You only need to brush up on lightweight FastAPI serving.
2. **Python & Data Science Internship (89% match)** — Strong foundational fit. 
3. **GenAI Workshop (86% match)** — Great for picking up practical RAG agent workflows.`;
    }
    if (lower.includes("missing") || lower.includes("internship")) {
      return `For Tier-1 AI Internships, analyzing your current skills (${p.skills.join(", ")}):
- **You have strong:** Python, basic Machine Learning, and PyTorch (82% competency).
- **Missing differentiator 1:** **Production API Deployment** (Docker containerization & FastAPI).
- **Missing differentiator 2:** **Vector DBs & RAG Frameworks** (LangChain or ChromaDB).
Adding these two items will move your Career Readiness from 76 to 88+.`;
    }
    if (lower.includes("improve") || lower.includes("profile")) {
      return `Here is the highest ROI plan to improve your SkillMatch profile:
1. **Add GitHub Repository Link** (+8% profile completeness).
2. **Form a Hackathon Team using TeamMatch** with a UI/UX developer (like Simran Kaur).
3. **Earn the '5 Projects' badge** in your Growth Dashboard.`;
    }
    if (lower.includes("project") || lower.includes("suggest")) {
      return `Here is a standout project suggestion tailored to your career goal (${p.careerGoal}):
**"Intelligent Multi-Agent Skill Gap Evaluator"**
- **Tech Stack:** Python, LangChain, PyTorch, React (frontend), FastAPI.
- **Why it strengthens your profile:** Demonstrates modern GenAI workflows rather than generic toy models, bridging your existing skills with high-demand deployment capabilities.`;
    }
    return `Looking at your SkillMatch profile, ${name}, you have a solid 82% profile strength with ${profile.skills.join(", ")}. You can strengthen your standing further by teaming up for the upcoming AI Hackathon!`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
      {/* Main Chat Window (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  AI Career Assistant
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Grounded in your verified SkillMatch profile & active opportunities.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Profile-specific guidance</span>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-amber-50/40 border-b border-amber-200/60 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-900 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Quick asks:
            </span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-medium text-xs border border-amber-200 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? "bg-stone-100 text-stone-900 border border-stone-200"
                      : "bg-stone-900 text-white shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isAI ? "text-stone-400" : "text-stone-300"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {!isAI && (
                  <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-800 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-100 p-3 rounded-2xl text-stone-600">
                AI is analyzing your profile and opportunity requirements...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about hackathons, internships, skill gaps, or profile improvements..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              id="career-assistant-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white transition-colors shadow-xs"
              id="career-assistant-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Active Profile Context (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">
              Active Profile Context
            </h3>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              SkillMatch Live Memory
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-400 font-semibold uppercase text-[10px] block">
                Target Student
              </span>
              <span className="font-bold text-stone-900 text-sm">
                {profile.name}
              </span>
              <div className="text-stone-500">{profile.course} · {profile.year}</div>
            </div>

            <div>
              <span className="text-stone-400 font-semibold uppercase text-[10px] block mb-1">
                Detected Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-stone-400 font-semibold uppercase text-[10px] block mb-1">
                Career Goal
              </span>
              <span className="font-semibold text-stone-800">
                {profile.careerGoal}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
              <div className="bg-stone-50 p-2 rounded-xl text-center border border-stone-200">
                <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                  Profile Strength
                </span>
                <span className="text-base font-bold text-stone-900">
                  {profile.profileStrength}%
                </span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl text-center border border-amber-200">
                <span className="text-[10px] text-amber-800 font-semibold uppercase block">
                  Career Readiness
                </span>
                <span className="text-base font-bold text-amber-900">
                  {profile.careerReadiness}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assistant Tips Card */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Why SkillMatch AI Assistant?</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Generic LLMs don't know your course, your verified hackathon history, or whether your campus team needs a designer. SkillMatch connects your actual profile data to real-time opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};
