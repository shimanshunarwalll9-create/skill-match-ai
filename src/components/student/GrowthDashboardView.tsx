import React from "react";
import {
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Calendar,
  AlertCircle,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { StudentProfile, AchievementBadge, GrowthMetrics } from "../../types";
import { sampleParticipationHistory } from "../../data/mockData";

interface GrowthDashboardViewProps {
  profile: StudentProfile;
  badges: AchievementBadge[];
  growth: GrowthMetrics;
  onNavigateTab: (tab: string) => void;
}

export const GrowthDashboardView: React.FC<GrowthDashboardViewProps> = ({
  profile,
  badges,
  growth,
  onNavigateTab,
}) => {
  const breakdown = profile.readinessBreakdown;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Performance & Growth
              </span>
              <span className="text-xs text-stone-400">
                Verified Skill Milestones
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              My Growth Dashboard 📈
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Track your skill momentum, active applications, verified completions, and AI Career Readiness Score.
            </p>
          </div>

          {/* Key counters */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-xl font-black text-stone-900">{growth.participations}</div>
              <div className="text-[10px] uppercase font-bold text-stone-500">Participations</div>
            </div>
            <div className="px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-xl font-black text-amber-600">{growth.applications}</div>
              <div className="text-[10px] uppercase font-bold text-stone-500">Applications</div>
            </div>
            <div className="px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-xl font-black text-emerald-700">{growth.completed}</div>
              <div className="text-[10px] uppercase font-bold text-stone-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 6: MAJOR VISUAL ELEMENT — Career Readiness Score */}
      <div className="bg-linear-to-br from-stone-900 via-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radial score display (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 mb-2">
              Career Readiness
            </span>

            <div className="relative flex items-center justify-center my-2">
              <div className="w-36 h-36 rounded-full border-8 border-stone-700 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-amber-500 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, -50% -50%, ${profile.careerReadiness}% 0%, 100% 100%, 0% 100%)`,
                  }}
                />
                <div className="text-center z-10">
                  <span className="text-4xl font-black tracking-tight text-white">
                    {profile.careerReadiness}
                  </span>
                  <span className="text-stone-400 text-base font-bold">/100</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-2 max-w-[220px]">
              AI-generated readiness indicator (not an objective employability guarantee)
            </p>
          </div>

          {/* Breakdown bars (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
                Score Composition Breakdown
              </h3>
              <span className="text-xs text-amber-400 font-semibold">
                Updated Real-Time
              </span>
            </div>

            <div className="space-y-3">
              {/* Skills */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-300">Skills Competency</span>
                  <span className="text-amber-400 font-bold">{breakdown.skills} / 100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${breakdown.skills}%` }}
                  />
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-300">Projects Depth & Deployment</span>
                  <span className="text-amber-400 font-bold">{breakdown.projects} / 100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${breakdown.projects}%` }}
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-300">Experience & Track Record</span>
                  <span className="text-amber-400 font-bold">{breakdown.experience} / 100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${breakdown.experience}%` }}
                  />
                </div>
              </div>

              {/* Participation */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-300">Hackathon & Challenge Participation</span>
                  <span className="text-amber-400 font-bold">{breakdown.participation} / 100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${breakdown.participation}%` }}
                  />
                </div>
              </div>

              {/* Profile Completeness */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-300">Profile Completeness</span>
                  <span className="text-amber-400 font-bold">{breakdown.profileCompleteness} / 100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${breakdown.profileCompleteness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Recommendation callout matching prompt */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                  🤖 AI Recommendation
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  "{profile.aiRecommendation}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section 5: Achievements / Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900">
              🏆 Verified Achievements & Activity Badges
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Earned through verified platform engagements
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isCompleted = badge.unlocked;
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-white border-stone-200 shadow-xs hover:border-amber-400"
                    : "bg-stone-50/70 border-stone-200 opacity-80"
                }`}
                id={`badge-${badge.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shadow-xs">
                    {badge.icon}
                  </div>
                  {isCompleted ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> In Progress
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 min-h-[36px]">
                  {badge.description}
                </p>

                {/* Progress bar */}
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCompleted ? "bg-emerald-600" : "bg-amber-600"
                      }`}
                      style={{
                        width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                  {badge.unlockedDate && (
                    <div className="text-[10px] text-stone-400 mt-1.5">
                      Earned: {badge.unlockedDate}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Activity & Participation History */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Verified Participation History
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Audited by Event Organizers
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {sampleParticipationHistory.map((item, idx) => (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-bold text-stone-900 text-sm">{item.title}</div>
                <div className="text-stone-500 mt-0.5">
                  {item.type} · Credited skills: {item.skillsCredited.join(", ")}
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="text-stone-400 text-[11px]">{item.date}</span>
                <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
