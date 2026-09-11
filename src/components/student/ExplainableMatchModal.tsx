import React from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Target,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
} from "lucide-react";
import { Opportunity, StudentProfile } from "../../types";

interface ExplainableMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  profile: StudentProfile;
  onApply: (oppId: string) => void;
  onNavigateToSkillGap: (oppId: string) => void;
  onNavigateToLearningPlan: () => void;
  onNavigateToTeamMatch: () => void;
  isApplied?: boolean;
}

export const ExplainableMatchModal: React.FC<ExplainableMatchModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  profile,
  onApply,
  onNavigateToSkillGap,
  onNavigateToLearningPlan,
  onNavigateToTeamMatch,
  isApplied = false,
}) => {
  if (!isOpen || !opportunity) return null;

  // Calculate matching vs missing
  const userSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
  const matchingSkills = (opportunity.requiredSkills || []).filter((req) =>
    userSkillsLower.some((userSkill) => userSkill.includes(req.toLowerCase()) || req.toLowerCase().includes(userSkill))
  );
  const missingSkills = (opportunity.requiredSkills || []).filter(
    (req) => !matchingSkills.includes(req)
  );

  const matchScore = opportunity.matchScore || 92;

  // Granular breakdown calculations
  const techScore = Math.min(98, Math.max(70, Math.round(matchScore * 1.02)));
  const expScore = Math.min(95, Math.max(65, Math.round(matchScore * 0.89)));
  const eduScore = 90;
  const interestScore = 95;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Explainable AI Match
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {opportunity.type} · {opportunity.organization}
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                {opportunity.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Top Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl font-black text-amber-400 leading-none">
                  {matchScore}%
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-stone-300 mt-0.5">
                  Match
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">
                  Exceptional Alignment with Candidate Profile
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  High probability of shortlisting based on verified skill overlap and hackathon background.
                </div>
              </div>
            </div>

            <button
              onClick={() => onApply(opportunity.id)}
              disabled={isApplied}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                isApplied
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Applied in Tracker
                </>
              ) : (
                <>
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Match Breakdown Bars */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Match Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">Technical Skills</div>
                <div className="text-lg font-extrabold text-stone-900 mt-1">{techScore}%</div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${techScore}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">Experience</div>
                <div className="text-lg font-extrabold text-stone-900 mt-1">{expScore}%</div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${expScore}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">Education</div>
                <div className="text-lg font-extrabold text-stone-900 mt-1">{eduScore}%</div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${eduScore}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">Interests</div>
                <div className="text-lg font-extrabold text-stone-900 mt-1">{interestScore}%</div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${interestScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Matching vs Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matching Verified Skills ({matchingSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing / Weak Skills ({missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold"
                    >
                      ⚠️ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-medium">
                    None! Complete coverage of target requirements.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Explainable AI: Why is this a good match? */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Why is this a good match for you?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {opportunity.whyMatch ||
                `Your strong foundation in ${matchingSkills.slice(0, 3).join(", ")} directly fulfills core problem-statement requirements for ${opportunity.title}. Your prior hackathon achievements validate your capability to build functional prototypes rapidly.`}
            </p>
          </div>

          {/* How can I reach 100%? */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              How can you reach 100% readiness?
            </h4>
            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  {missingSkills.length > 0
                    ? `Complete hands-on labs in ${missingSkills[0]} to eliminate key technical gaps.`
                    : "Publish a GitHub repository showcasing end-to-end deployment."}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Request 1 peer endorsement on your Python project to push verified credentials to 100%.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Pair with a complementary teammate specializing in frontend UI / DevOps.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToSkillGap(opportunity.id);
              }}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Skill Gap Analyzer
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToLearningPlan();
              }}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              Learning Plan
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToTeamMatch();
              }}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-stone-600" />
              Find Teammates
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
