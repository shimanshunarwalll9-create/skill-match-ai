import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  Bot,
  Bell,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Github,
  MapPin,
  Calendar,
  AlertCircle,
  Plus,
  Check,
  ShieldCheck,
  Award,
} from "lucide-react";
import { StudentProfile, Opportunity, GrowthMetrics } from "../../types";
import { VerifiedSkillBadge } from "./VerifiedSkillBadge";
import { getSkillVerification } from "../../utils/matchingEngine";

interface StudentHomeProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  growth: GrowthMetrics;
  onNavigateTab: (tab: string) => void;
  onUpdateProfileStrength: (newScore: number, github: string) => void;
  onApplyOpportunity: (id: string) => void;
  onOpenProfileEditor?: () => void;
  onAddSkillToProfile?: (skill: string) => void;
  onOpenCreateOpp?: () => void;
  onOpenVerificationHub?: () => void;
  onOpenRequestEndorsement?: (skill?: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  profile,
  opportunities,
  growth,
  onNavigateTab,
  onUpdateProfileStrength,
  onApplyOpportunity,
  onOpenProfileEditor,
  onAddSkillToProfile,
  onOpenCreateOpp,
  onOpenVerificationHub,
  onOpenRequestEndorsement,
}) => {
  const [selectedOppId, setSelectedOppId] = useState<string | null>("opp-1");
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUrlInput, setGithubUrlInput] = useState(profile.githubUrl || "");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const firstName = profile.name.split(" ")[0] || "Rahul";

  // Top 3 matches specifically highlighted per the prompt
  const topMatches = opportunities.slice(0, 3);
  const activeOpp = opportunities.find((o) => o.id === selectedOppId) || topMatches[0];

  const verifiedSkillsCount = (profile.skills || []).filter(
    (s) => getSkillVerification(s, profile.endorsements || []).isVerified
  ).length;

  const handleSaveGithub = () => {
    if (githubUrlInput.trim()) {
      onUpdateProfileStrength(Math.min(95, profile.profileStrength + 8), githubUrlInput);
      setShowGithubModal(false);
    }
  };

  const toggleStep = (skill: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Greeting Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Verified Student
              </span>
              <span className="text-xs text-stone-400">
                {profile.course} · {profile.year}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                👋 Good morning, {firstName}
              </h1>
              {onOpenProfileEditor && (
                <button
                  type="button"
                  onClick={onOpenProfileEditor}
                  className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-stone-200"
                  id="student-edit-profile-btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Edit Real Profile & Skills
                </button>
              )}
            </div>
            <p className="text-sm text-stone-500 mt-1">
              Here is your daily SkillMatch overview, personalized matches, and career trajectory.
            </p>
          </div>

          {/* Profile Strength Indicator */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 min-w-[280px]">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold text-stone-700">Profile strength</span>
              <span className="font-bold text-stone-900">{profile.profileStrength}%</span>
            </div>

            {/* Visual ASCII/Bar Progress representation */}
            <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${profile.profileStrength}%` }}
              />
            </div>

            {/* Recommendation Prompt */}
            <div className="mt-2.5 flex items-start justify-between gap-2">
              <p className="text-xs text-stone-600 leading-relaxed">
                Update skills or link GitHub/projects to boost your score.
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                {onOpenProfileEditor && (
                  <button
                    onClick={onOpenProfileEditor}
                    className="text-xs text-amber-700 font-bold hover:underline"
                  >
                    Edit Profile
                  </button>
                )}
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => setShowGithubModal(true)}
                  className="text-xs text-stone-600 font-semibold hover:text-stone-900 flex items-center gap-0.5"
                  id="boost-profile-btn"
                >
                  <Plus className="w-3 h-3" /> Links
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Skill Verifications & Teammate Badges Showcase */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  🛡️ Teammate Skill Verifications & Badges
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {verifiedSkillsCount} of {profile.skills?.length || 0} Verified
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Endorsements from hackathon teammates provide proof to recruiters and boost your match ranking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onOpenRequestEndorsement && (
              <button
                type="button"
                onClick={() => onOpenRequestEndorsement()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                id="request-verification-quick-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Request Endorsement
              </button>
            )}
            {onOpenVerificationHub && (
              <button
                type="button"
                onClick={onOpenVerificationHub}
                className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                id="view-all-verifications-btn"
              >
                Verification Hub →
              </button>
            )}
          </div>
        </div>

        {/* Skill Badges List */}
        <div className="flex flex-wrap gap-2 pt-1 items-center">
          {profile.skills?.map((skill) => (
            <VerifiedSkillBadge
              key={skill}
              skill={skill}
              endorsements={profile.endorsements || []}
              onRequestEndorsement={onOpenRequestEndorsement}
              onViewVerificationDetails={() => onOpenVerificationHub?.()}
            />
          ))}
          {(!profile.skills || profile.skills.length === 0) && (
            <span className="text-xs text-stone-400 italic">
              No skills listed yet. Add skills in profile to request endorsements.
            </span>
          )}
        </div>
      </div>

      {/* 3. Notification Banner: "🔔 New for you" */}
      <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">
                🔔 New for you
              </h2>
              <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                3 New Matches
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              3 new opportunities match your interests and Python/ML skills.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab("opportunities")}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs self-end sm:self-center"
          id="banner-view-matches-btn"
        >
          View Matched Feed
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Main Dashboard Grid: Top Matches & Growth Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (7 cols): 🎯 Top Matches */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-900">
                🎯 Top matches
              </span>
              <span className="text-xs text-stone-400">
                Ranked by AI Compatibility
              </span>
            </div>
            <button
              onClick={() => onNavigateTab("opportunities")}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              See all ({opportunities.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map((opp) => {
              const isSelected = selectedOppId === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOppId(opp.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-amber-500 ring-2 ring-amber-500/10 shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                  id={`top-match-${opp.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {opp.type}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {opp.location}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {opp.deadline}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        Hosted by {opp.hostOrg}
                      </p>
                    </div>

                    {/* Circular Match Gauge */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-linear-to-tr from-amber-500 to-amber-600 text-white flex flex-col items-center justify-center font-bold text-sm shadow-xs">
                        <span>{opp.matchPercentage}%</span>
                        <span className="text-[9px] font-normal uppercase tracking-wider opacity-90">
                          match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags preview */}
                  <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-stone-400">
                        Matched:
                      </span>
                      {opp.matchedSkills.map((s) => {
                        const isVerified = getSkillVerification(s, profile.endorsements || []).isVerified;
                        return (
                          <span
                            key={s}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                              isVerified
                                ? "bg-emerald-100/80 text-emerald-950 border-emerald-300 font-semibold"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                            title={isVerified ? `${s} is peer verified by teammates` : s}
                          >
                            <span>✓ {s}</span>
                            {isVerified && (
                              <ShieldCheck className="w-3 h-3 text-emerald-700 inline shrink-0" />
                            )}
                          </span>
                        );
                      })}
                      {opp.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyOpportunity(opp.id);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          opp.applied
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-stone-900 text-white hover:bg-stone-800"
                        }`}
                      >
                        {opp.applied ? "Applied ✓" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Skill Gap: "How to Reach 100%" */}
          {activeOpp && activeOpp.missingSkills.length > 0 && (
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Skill Gap Analysis — Reach 100% for {activeOpp.title}
                  </h4>
                </div>
                <span className="text-xs font-bold text-amber-700">
                  Current: {activeOpp.matchPercentage}%
                </span>
              </div>

              <p className="text-xs text-stone-600">
                You already possess {activeOpp.matchedSkills.join(", ")}. Complete these targeted steps to check off the remaining requirements:
              </p>

              <div className="space-y-2">
                {activeOpp.missingSkills.map((missingSkill) => {
                  const isDone = completedSteps[missingSkill];
                  return (
                    <div
                      key={missingSkill}
                      className="bg-white p-3 rounded-xl border border-amber-200 flex items-start gap-3 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!isDone}
                        onChange={() => toggleStep(missingSkill)}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            onClick={() => toggleStep(missingSkill)}
                            className={`text-xs font-bold cursor-pointer ${
                              isDone ? "line-through text-stone-400" : "text-stone-900"
                            }`}
                          >
                            Build a mini-project or certify in {missingSkill}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-600">
                              +{Math.round((100 - activeOpp.matchPercentage) / activeOpp.missingSkills.length)}% Match
                            </span>
                            {onAddSkillToProfile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddSkillToProfile(missingSkill);
                                }}
                                className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold transition-colors"
                                title={`Add ${missingSkill} directly to your profile`}
                              >
                                + Add to My Skills
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Push a standalone repository or add {missingSkill} to your skills to instantly elevate your match score.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): 📈 Growth Preview & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* 📈 Your Growth Preview */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  📈 Your Growth
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Active Streak: {growth.streakDays}d 🔥
              </span>
            </div>

            {/* High-level counters matching prompt */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-stone-50 rounded-xl border border-stone-200">
              <div className="p-2">
                <div className="text-2xl font-black text-stone-900">
                  {growth.participations}
                </div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
                  Participations
                </div>
              </div>

              <div className="p-2 border-x border-stone-200">
                <div className="text-2xl font-black text-amber-600">
                  {growth.applications}
                </div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
                  Applications
                </div>
              </div>

              <div className="p-2">
                <div className="text-2xl font-black text-emerald-700">
                  {growth.completed}
                </div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
                  Completed
                </div>
              </div>
            </div>

            {/* Career Readiness Preview Badge */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-950">
                  Career Readiness Indicator
                </div>
                <div className="text-[11px] text-stone-500">
                  Skills: {profile.readinessBreakdown.skills} · Projects: {profile.readinessBreakdown.projects}
                </div>
              </div>
              <div className="text-lg font-black text-stone-900">
                {profile.careerReadiness}/100
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("growth")}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              id="view-my-growth-btn"
            >
              [View My Growth]
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Shortcuts to Killer Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Skill Verification Hub Card */}
            <div
              onClick={() => onOpenVerificationHub?.()}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
              id="quick-verification-card"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Manage Badges →
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-2.5 flex items-center gap-1.5">
                <span>Skill Verifications</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {verifiedSkillsCount} Badges
                </span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Request peer endorsements from past teammates or endorse collaborators to boost trust credibility.
              </p>
            </div>

            {/* TeamMatch Card */}
            <div
              onClick={() => onNavigateTab("teammatch")}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
              id="quick-teammatch-card"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Find Teammates →
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-2.5">
                AI TeamMatch
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Connect with complementary students like Simran Kaur (React + UI/UX) for the AI Hackathon.
              </p>
            </div>

            {/* AI Career Assistant Card */}
            <div
              onClick={() => onNavigateTab("assistant")}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
              id="quick-assistant-card"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Ask AI →
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-2.5">
                AI Career Assistant
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Get specific guidance on what internships to target and how to bridge skill gaps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Boost Profile Modal (GitHub Link) */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Complete GitHub / Project Link
                </h3>
                <p className="text-xs text-stone-500">
                  Boost your profile strength to {Math.min(95, profile.profileStrength + 8)}%
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                GitHub Profile or Project URL
              </label>
              <input
                type="url"
                value={githubUrlInput}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                placeholder="https://github.com/rahul-ai-dev"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGithub}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Update & Boost Strength
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
