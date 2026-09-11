import React, { useState } from "react";
import {
  Users,
  Sparkles,
  Search,
  CheckCircle2,
  Send,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { StudentProfile, TeammateCandidate, Opportunity } from "../../types";

interface TeamMatchViewProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  teammates: TeammateCandidate[];
  onInviteTeammate: (candidateId: string) => void;
}

export const TeamMatchView: React.FC<TeamMatchViewProps> = ({
  profile,
  opportunities,
  teammates,
  onInviteTeammate,
}) => {
  const [selectedTargetOpp, setSelectedTargetOpp] = useState<string>("opp-1");
  const [neededSkillsFilter, setNeededSkillsFilter] = useState<string>("React + UI/UX");
  const [activeTeammates, setActiveTeammates] = useState<TeammateCandidate[]>(teammates);
  const [inviteModalCandidate, setInviteModalCandidate] = useState<TeammateCandidate | null>(null);
  const [inviteNote, setInviteNote] = useState("");
  const [squad, setSquad] = useState<string[]>(["Rahul Sharma (ML Lead)"]);

  const targetOpp =
    opportunities.find((o) => o.id === selectedTargetOpp) || opportunities[0];

  const handleSendInvite = () => {
    if (!inviteModalCandidate) return;
    onInviteTeammate(inviteModalCandidate.id);
    setActiveTeammates((prev) =>
      prev.map((t) =>
        t.id === inviteModalCandidate.id ? { ...t, invited: true } : t
      )
    );
    if (!squad.includes(inviteModalCandidate.name)) {
      setSquad((prev) => [...prev, `${inviteModalCandidate.name} (${inviteModalCandidate.roleTitle.split(" ")[0]})`]);
    }
    setInviteModalCandidate(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Killer Differentiator
              </span>
              <span className="text-xs text-stone-400">
                Skill Complement Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              AI TeamMatch 🧑🤝🧑
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Since SkillMatch already indexes verified skill profiles, AI automatically pairs you with candidates whose skills complement your own for hackathons.
            </p>
          </div>

          {/* Current Squad Status Box */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 min-w-[260px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-600 uppercase">Your Squad</span>
              <span className="font-bold text-stone-900">{squad.length}/4 Members</span>
            </div>
            <div className="space-y-1 text-xs font-medium text-stone-800">
              {squad.map((member, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{member}</span>
                </div>
              ))}
              {squad.length < 4 && (
                <div className="text-stone-400 italic text-[11px]">
                  + {4 - squad.length} slot{4 - squad.length > 1 ? "s" : ""} remaining for {neededSkillsFilter}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TeamMatch Configuration Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Select Event */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Select Target Opportunity
            </label>
            <select
              value={selectedTargetOpp}
              onChange={(e) => setSelectedTargetOpp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              id="teammatch-opp-select"
            >
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} ({o.type}) — {o.matchPercentage}% Match
                </option>
              ))}
            </select>
          </div>

          {/* Need Skills Filter */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              What skills does your team need?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "React + UI/UX",
                "Figma & Frontend",
                "Cloud & DevOps (Docker)",
                "FastAPI Backend",
                "All Available",
              ].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setNeededSkillsFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    neededSkillsFilter === filter
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recommended Teammates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              AI Suggested Teammates
            </h2>
            <span className="text-xs text-stone-400">
              Calculated based on {profile.name}'s stack + {targetOpp.title}
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {activeTeammates.length} Compatible Peers Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeTeammates.map((candidate) => {
            const isTopMatch = candidate.compatibility >= 90;
            return (
              <div
                key={candidate.id}
                className={`p-5 rounded-2xl border transition-all bg-white relative flex flex-col justify-between ${
                  isTopMatch
                    ? "border-amber-400 shadow-md ring-1 ring-amber-400/20"
                    : "border-stone-200 hover:border-stone-300"
                }`}
                id={`candidate-${candidate.id}`}
              >
                {isTopMatch && (
                  <div className="absolute -top-2.5 right-6 bg-linear-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    Highest Synergy
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {candidate.college} · {candidate.year}
                        </p>
                        <p className="text-xs font-semibold text-amber-700 mt-0.5">
                          {candidate.roleTitle}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-emerald-700">
                        {candidate.compatibility}%
                      </div>
                      <div className="text-[10px] font-semibold text-stone-400 uppercase">
                        Compatibility
                      </div>
                    </div>
                  </div>

                  {/* Skills tags: Highlighted per prompt */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-3 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-stone-500">
                      Complementary Stack:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill) => {
                        const isComplementary = candidate.complementarySkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                              isComplementary
                                ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                                : "bg-white text-stone-700 border border-stone-200"
                            }`}
                          >
                            {skill} {isComplementary && "⭐"}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Match Reason */}
                  <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
                    "{candidate.matchReason}"
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Ready for {targetOpp.type}
                  </span>
                  <button
                    onClick={() => {
                      if (!candidate.invited) {
                        setInviteModalCandidate(candidate);
                        setInviteNote(
                          `Hey ${candidate.name.split(" ")[0]}, let's team up for ${targetOpp.title}! I'm focusing on the ML models and your experience with ${candidate.complementarySkills.join(", ")} is the perfect match.`
                        );
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      candidate.invited
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold cursor-default"
                        : "bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                    }`}
                  >
                    {candidate.invited ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Invitation Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Invite to Team
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                {inviteModalCandidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Invite {inviteModalCandidate.name} to Team
                </h3>
                <p className="text-xs text-stone-500">
                  {inviteModalCandidate.compatibility}% Compatibility · {inviteModalCandidate.roleTitle}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Personalized Invite Note
              </label>
              <textarea
                rows={4}
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInviteModalCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                id="confirm-send-invite-btn"
              >
                <Send className="w-3.5 h-3.5" /> Send Teammate Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
