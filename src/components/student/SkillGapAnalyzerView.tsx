import React, { useState } from "react";
import {
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Plus,
  Clock,
  ExternalLink,
  ChevronDown,
  Layers,
  Zap,
} from "lucide-react";
import { Opportunity, StudentProfile, SkillScoreItem } from "../../types";

interface SkillGapAnalyzerViewProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  skillScores: SkillScoreItem[];
  selectedOppId?: string | null;
  onNavigateToLearningPlan: () => void;
  onAddSkill: (skill: string) => void;
  onSelectOpp?: (oppId: string) => void;
}

export const SkillGapAnalyzerView: React.FC<SkillGapAnalyzerViewProps> = ({
  opportunities,
  profile,
  skillScores,
  selectedOppId,
  onNavigateToLearningPlan,
  onAddSkill,
  onSelectOpp,
}) => {
  const [activeOppId, setActiveOppId] = useState<string>(
    selectedOppId || (opportunities[0]?.id || "opp-1")
  );

  const activeOpp = opportunities.find((o) => o.id === activeOppId) || opportunities[0];

  const userSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
  const required = activeOpp?.requiredSkills || [];

  const matched = required.filter((req) =>
    userSkillsLower.some(
      (us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)
    )
  );

  const missing = required.filter((req) => !matched.includes(req));

  const currentMatch = activeOpp?.matchScore || 78;
  const potentialMatch = Math.min(99, currentMatch + missing.length * 6 + 4);

  // Generate dynamic roadmap for missing skills
  const roadmapItems = missing.map((skill, idx) => {
    const priority: "High" | "Medium" | "Low" = idx === 0 ? "High" : idx === 1 ? "Medium" : "Low";
    const hours = idx === 0 ? 8 : idx === 1 ? 6 : 4;
    const gain = idx === 0 ? 8 : idx === 1 ? 5 : 3;

    return {
      skill,
      priority,
      estimatedHours: hours,
      potentialGain: gain,
      recommendedResource: `${skill} Core Lab & Interactive Problem Sets`,
      url: "https://developers.google.com",
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Header Card with Selector */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Comparative Gap Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Skill Gap Analyzer
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              Select any target opportunity to compare your current skill matrix against employer specifications and unlock an actionable roadmap to 100% readiness.
            </p>
          </div>

          {/* Opportunity Dropdown Selector */}
          <div className="w-full sm:w-80">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select Target Opportunity
            </label>
            <div className="relative">
              <select
                value={activeOppId}
                onChange={(e) => {
                  setActiveOppId(e.target.value);
                  if (onSelectOpp) onSelectOpp(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none pr-8 shadow-2xs"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} ({opp.organization}) — {opp.matchScore}%
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Current vs Potential Match Comparison Banner */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-amber-50/40 border border-stone-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-amber-400 leading-none">
                {currentMatch}%
              </span>
              <span className="text-[9px] uppercase font-bold text-stone-300 mt-0.5">Current</span>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Current Readiness Match</div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Based on verified skills in your active profile
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-emerald-200 leading-none">
                {potentialMatch}%
              </span>
              <span className="text-[9px] uppercase font-bold text-emerald-100 mt-0.5">Target</span>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Potential After Improvement</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                +{potentialMatch - currentMatch}% uplift within ~14 days
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={onNavigateToLearningPlan}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Open 30-Day Learning Plan
            </button>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Skills Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Verified Skills Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                Your Matched Skills ({matched.length})
              </h3>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified & Ready
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matched.map((s) => (
              <div
                key={s}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {s}
              </div>
            ))}
            {matched.length === 0 && (
              <span className="text-xs text-stone-500">No overlapping skills found.</span>
            )}
          </div>

          <p className="text-xs text-stone-500 pt-2 leading-relaxed">
            These skills satisfy core prerequisites for {activeOpp?.title}. Maintain your portfolio artifacts and code repos to back them up during technical screening.
          </p>
        </div>

        {/* Missing / Weak Skills Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                Missing / Weak Skills ({missing.length})
              </h3>
            </div>
            <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              High Impact Gaps
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <div
                key={s}
                className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950 flex items-center justify-between gap-2"
              >
                <span>⚠️ {s}</span>
                <button
                  type="button"
                  onClick={() => onAddSkill(s)}
                  title="Add to profile"
                  className="hover:text-amber-800 text-stone-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {missing.length === 0 && (
              <span className="text-xs text-emerald-700 font-semibold">
                🎉 No gaps! Your profile completely covers all listed requirements.
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 pt-2 leading-relaxed">
            Acquiring or verifying these {missing.length} competencies will bridge the remaining gap and substantially increase your selection rate.
          </p>
        </div>
      </div>

      {/* 3. Personalized Improvement Roadmap Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Personalized Improvement Roadmap
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Prioritized step-by-step path designed to lift match score to {potentialMatch}%
            </p>
          </div>
          <button
            onClick={onNavigateToLearningPlan}
            className="text-xs text-amber-700 font-semibold hover:text-amber-900 flex items-center gap-1"
          >
            Manage in Learning Plan <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-y border-stone-200">
              <tr>
                <th className="py-3 px-4">Skill Target</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Est. Effort</th>
                <th className="py-3 px-4">Match Uplift</th>
                <th className="py-3 px-4">Recommended Resource</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {roadmapItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {item.skill}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.priority === "High"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : item.priority === "Medium"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {item.estimatedHours} hrs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    +{item.potentialGain}%
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {item.recommendedResource}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onNavigateToLearningPlan}
                      className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] transition-colors"
                    >
                      Learn Now
                    </button>
                  </td>
                </tr>
              ))}
              {roadmapItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-stone-500">
                    No open gaps for this opportunity! You are completely aligned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
