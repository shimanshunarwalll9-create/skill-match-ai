import React, { useState } from "react";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Star,
  Target,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { AchievementBadge } from "../../types";

interface AchievementsViewProps {
  badges: AchievementBadge[];
  xp: number;
  onClaimBadge?: (badgeId: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  badges,
  xp,
  onClaimBadge,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculate Level based on XP: Level = Math.floor(xp / 200)
  const currentLevel = Math.max(1, Math.floor(xp / 200));
  const currentLevelTitle =
    currentLevel >= 10
      ? "AI Principal Architect"
      : currentLevel >= 8
      ? "Master Architect"
      : currentLevel >= 7
      ? "AI Explorer"
      : currentLevel >= 5
      ? "Full-Stack Specialist"
      : currentLevel >= 3
      ? "Code Pathfinder"
      : "Junior Hacker";

  const nextLevelXP = (currentLevel + 1) * 200;
  const currentLevelBaseXP = currentLevel * 200;
  const xpInCurrentLevel = xp - currentLevelBaseXP;
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / 200) * 100));

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const categories = [
    { key: "all", label: "All Badges" },
    { key: "hackathon", label: "Hackathons" },
    { key: "learning", label: "Learning & Skills" },
    { key: "projects", label: "Projects" },
    { key: "applications", label: "Opportunities" },
    { key: "streak", label: "Streaks" },
  ];

  const filteredBadges = badges.filter(
    (b) => selectedCategory === "all" || b.category === selectedCategory
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Level Progress Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Gamified Career Milestones
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Achievements & Experience
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl">
              Earn XP by completing learning tasks, verifying peer skill endorsements, and maintaining active participation streaks.
            </p>
          </div>

          {/* Level Badge Card */}
          <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl p-5 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black flex flex-col items-center justify-center shadow-xs">
              <span className="text-xs uppercase tracking-wider text-amber-100 font-bold">Lvl</span>
              <span className="text-2xl leading-none">{currentLevel}</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900">
                {currentLevelTitle}
              </div>
              <div className="text-xs text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                {xp} Total Platform XP
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {unlockedCount} of {badges.length} badges unlocked
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-stone-100 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>
              Progress to Level {currentLevel + 1}
            </span>
            <span>
              {xpInCurrentLevel} / 200 XP ({levelProgress}%)
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Streak & Weekly Highlight */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-950">
                🔥 7-Day Continuous Learning Streak
              </div>
              <div className="text-[11px] text-orange-800 mt-0.5">
                Study tomorrow to unlock the 8-Day Multiplier bonus (+50 XP).
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Top 5% Hackathon Readiness Tier
              </div>
              <div className="text-[11px] text-emerald-800 mt-0.5">
                Eligible for expedited fast-track reviews by hackathon organizers.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c.key
                ? "bg-stone-900 text-white shadow-2xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                badge.unlocked
                  ? "border-amber-200/80 shadow-2xs hover:shadow-xs bg-gradient-to-b from-white to-amber-50/20"
                  : "border-stone-200 bg-stone-50/40 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    badge.unlocked
                      ? "bg-amber-100 text-amber-900 shadow-2xs"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-5 h-5 text-stone-400" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">
                      {badge.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress or unlocked status */}
              <div className="pt-3 border-t border-stone-100 space-y-1.5">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {badge.unlockedDate || "Achieved"}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-stone-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{
                          width: `${Math.round((badge.progress / badge.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
