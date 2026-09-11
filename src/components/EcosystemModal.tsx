import React from "react";
import {
  X,
  Sparkles,
  ArrowDown,
  ArrowRight,
  GraduationCap,
  Building2,
  FileText,
  Bot,
  Bell,
  Send,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";

interface EcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const EcosystemModal: React.FC<EcosystemModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const differentiators = [
    {
      num: 1,
      title: "AI Resume → Profile",
      desc: "Instant automated onboarding extracting verified skills, interests, and project experience.",
      tab: "home",
      icon: "📄",
    },
    {
      num: 2,
      title: "AI Student ↔ Opportunity Matching",
      desc: "Bidirectional scoring ranking opportunities by exact syllabus/skill compatibility.",
      tab: "opportunities",
      icon: "🎯",
    },
    {
      num: 3,
      title: "Personalized Notifications",
      desc: "Smart alerts triggered only when genuine skill match thresholds (>80%) are satisfied.",
      tab: "home",
      icon: "🔔",
    },
    {
      num: 4,
      title: "Skill Gap + Improve My Match",
      desc: "'How to reach 100%' actionable ladder turning rejections into clear project blueprints.",
      tab: "opportunities",
      icon: "🪜",
    },
    {
      num: 5,
      title: "My Growth & Career Readiness",
      desc: "76/100 Readiness index, verifiable badges, and participation auditing.",
      tab: "growth",
      icon: "📈",
    },
    {
      num: 6,
      title: "AI TeamMatch ← Killer Feature",
      desc: "Synthesizes student skills to form complementary squads (e.g. ML Lead + React UI/UX).",
      tab: "teammatch",
      icon: "🧑🤝🧑",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                SkillMatch AI Ecosystem
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                The coherent circular flow bridging verified student skillsets with organizer opportunities.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Interactive Flow Diagram */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-6">
            <div className="text-center font-bold text-xs uppercase tracking-widest text-stone-500">
              Platform Architecture Flow
            </div>

            {/* Top Branches: Students & Organizers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Side */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 font-bold text-sm text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  <GraduationCap className="w-4 h-4" /> STUDENTS
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Create Profile</div>
                  <div className="text-stone-300">↓</div>
                  <div>Upload Resume</div>
                  <div className="text-stone-300">↓</div>
                  <div className="font-semibold text-emerald-800">
                    AI extracts skills & interests
                  </div>
                </div>
              </div>

              {/* Organizer Side */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 font-bold text-sm text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  <Building2 className="w-4 h-4" /> ORGANIZERS
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Create Opportunity</div>
                  <div className="text-stone-300">↓</div>
                  <div>Paste Plain Description</div>
                  <div className="text-stone-300">↓</div>
                  <div className="font-semibold text-blue-800">
                    AI analyzes event & sizes audience
                  </div>
                </div>
              </div>
            </div>

            {/* Center: AI Matching Hub */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-amber-400" />
              <div className="bg-linear-to-r from-amber-600 to-amber-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span>🤖 AI MATCHING ENGINE</span>
              </div>
              <div className="w-0.5 h-6 bg-amber-400" />
            </div>

            {/* Downstream Cycle */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 font-semibold text-stone-800">
                Personalized Feed
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 font-semibold text-stone-800">
                Notifications (🔔)
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 font-semibold text-stone-800">
                Applications
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 font-semibold text-stone-800">
                Participation (🏆)
              </div>
            </div>

            {/* Continuous Loop Return */}
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs text-center font-semibold">
              📈 My Growth → 🪜 Skill Gap Analysis → 🎯 Better Future Matches & High Compatibility
            </div>
          </div>

          {/* Section: ⭐ Your Strongest Differentiators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-stone-900">
                ⭐ The 6 Core Differentiators Built in SkillMatch AI
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {differentiators.map((diff) => (
                <div
                  key={diff.num}
                  onClick={() => {
                    onNavigateTab(diff.tab);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-3.5"
                >
                  <div className="text-2xl shrink-0">{diff.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                        {diff.num}. {diff.title}
                      </h4>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            A cohesive product experience instead of isolated AI demos.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
          >
            Back to Application
          </button>
        </div>
      </div>
    </div>
  );
};
