import React, { useState } from "react";
import {
  Building2,
  Sparkles,
  Users,
  Send,
  Plus,
  Globe,
  Mail,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Check,
} from "lucide-react";
import { OrganizerProfile, Opportunity } from "../../types";

interface OrganizerDashboardViewProps {
  organizer: OrganizerProfile;
  opportunities: Opportunity[];
  onAddOpportunity: (opp: Opportunity) => void;
}

export const OrganizerDashboardView: React.FC<OrganizerDashboardViewProps> = ({
  organizer,
  opportunities,
  onAddOpportunity,
}) => {
  const [copilotInput, setCopilotInput] = useState(
    "We are hosting a 36-hour National AI/ML Hackathon for undergraduate students who know Python, PyTorch, and are interested in autonomous multi-agent systems and computer vision prototypes."
  );
  const [isExtracting, setIsExtracting] = useState(false);

  // Opportunity form
  const [title, setTitle] = useState("AI/ML National Hackathon 2026");
  const [type, setType] = useState<Opportunity["type"]>("Hackathon");
  const [requiredSkills, setRequiredSkills] = useState("Python, Machine Learning, PyTorch, Git");
  const [eligibility, setEligibility] = useState("Undergraduate & Graduate students");
  const [deadline, setDeadline] = useState("Oct 24, 2026");
  const [location, setLocation] = useState("Hybrid / Bengaluru Hub");
  const [description, setDescription] = useState(
    "Build autonomous multi-agent systems and real-world computer vision prototypes. $20,000 prize pool with direct industry mentorship."
  );

  // Audience sizing state (as requested in Section 8)
  const [audienceStats, setAudienceStats] = useState<{
    potential: number;
    highlyRelevant: number;
    recommended: number;
  }>({
    potential: 382,
    highlyRelevant: 96,
    recommended: 96,
  });

  const [notificationSent, setNotificationSent] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleRunAICopilot = async () => {
    setIsExtracting(true);
    try {
      const res = await fetch("/api/ai/extract-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: copilotInput }),
      });
      const data = await res.json();
      if (data) {
        if (data.title) setTitle(data.title);
        if (data.type) setType(data.type);
        if (Array.isArray(data.requiredSkills)) {
          setRequiredSkills(data.requiredSkills.join(", "));
        }
        if (data.eligibility) setEligibility(data.eligibility);
        if (data.summary) setDescription(data.summary);
        if (data.estimatedAudience) {
          setAudienceStats({
            potential: data.estimatedAudience.potential || 382,
            highlyRelevant: data.estimatedAudience.highlyRelevant || 96,
            recommended: data.estimatedAudience.recommendedNotification || 96,
          });
        }
      }
    } catch (e) {
      // Local fallback
      setTitle("AI/ML National Hackathon 2026");
      setRequiredSkills("Python, Machine Learning, Git, PyTorch");
      setAudienceStats({
        potential: 382,
        highlyRelevant: 96,
        recommended: 96,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title,
      type,
      hostOrg: organizer.orgName,
      matchPercentage: 92,
      requiredSkills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      matchedSkills: ["Python", "Machine Learning", "Git"],
      missingSkills: ["PyTorch"],
      eligibility,
      deadline,
      location,
      mode: location.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
      description,
      tag: "Organizer Published",
      perks: ["Cloud Credits", "Fast-Track Review"],
    };

    onAddOpportunity(newOpp);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);
  };

  const handleBroadcastNotification = () => {
    setNotificationSent(true);
    setTimeout(() => {
      alert(`Dispatched personalized alerts to ${audienceStats.recommended} highly relevant students with matching skill profiles!`);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* 1. Header & Organizer Profile Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Building2 className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900">
                  {organizer.orgName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {organizer.orgType}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 max-w-xl">
                {organizer.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {organizer.website}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {organizer.contact}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-xl font-black text-stone-900">{opportunities.length}</div>
              <div className="text-[10px] uppercase font-bold text-stone-500">Events Hosted</div>
            </div>
            <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <div className="text-xl font-black text-amber-800">478</div>
              <div className="text-[10px] uppercase font-bold text-amber-900">Students Reached</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 8: AI Audience Card (High-Impact Visual) */}
      <div className="bg-linear-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-900 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                AI Audience Sizing & Targeted Reach
              </h2>
              <p className="text-xs text-stone-300">
                Calculated automatically across SkillMatch's active verified student pool.
              </p>
            </div>
          </div>

          <button
            onClick={handleBroadcastNotification}
            disabled={notificationSent}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              notificationSent
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-amber-500 hover:bg-amber-400 text-stone-900 shadow-md"
            }`}
            id="notify-matched-audience-btn"
          >
            {notificationSent ? (
              <>
                <Check className="w-4 h-4" /> Matched Students Notified
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Notify Matched Students ({audienceStats.recommended})
              </>
            )}
          </button>
        </div>

        {/* 3 Prominent Stat Blocks from Section 8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">
              Potentially relevant students
            </div>
            <div className="text-3xl font-black text-white">
              {audienceStats.potential}
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Enrolled students with related coursework or engineering disciplines.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 border border-amber-400/40 relative">
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Highly relevant</span>
              <span className="text-[9px] bg-amber-400 text-stone-900 font-bold px-1.5 py-0.2 rounded">
                80%+ Match
              </span>
            </div>
            <div className="text-3xl font-black text-amber-400">
              {audienceStats.highlyRelevant}
            </div>
            <p className="text-[11px] text-stone-300 mt-2">
              Students who already have 3+ required skills verified on their profile.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              Recommended notification audience
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {audienceStats.recommended}
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              High open-rate cohort with active learning streaks and interest in {type}s.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Section 8: Create Opportunity with AI Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: AI Copilot & Creation Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-stone-900">
                Create Opportunity with AI Auto-Extraction
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Paste your raw event brochure or prompt below. AI will automatically extract requirements.
            </p>
          </div>

          {/* AI Copilot Box */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              AI Copilot — Paste Plain Event Description:
            </label>
            <textarea
              rows={3}
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="e.g. We are conducting a 24-hour AI hackathon for college students who know Python and are interested in machine learning..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleRunAICopilot}
              disabled={isExtracting}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
              id="ai-extract-requirements-btn"
            >
              <Sparkles className="w-4 h-4" />
              {isExtracting ? "AI is analyzing text..." : "Auto-Extract Requirements (AI) →"}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handlePublish} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Opportunity Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Opportunity["type"])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option>Hackathon</option>
                  <option>Internship</option>
                  <option>Workshop</option>
                  <option>Competition</option>
                  <option>Scholarship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Location / Mode
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {publishedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Published successfully! Added to matched student feeds.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              id="publish-opportunity-btn"
            >
              Publish Opportunity to SkillMatch Ecosystem
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Active Published Opportunities (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Your Published Events
              </h3>
              <span className="text-xs text-stone-400">
                {opportunities.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                      {opp.type}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {opp.deadline}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {opp.title}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {opp.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-0.2 bg-white text-stone-600 rounded border border-stone-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
