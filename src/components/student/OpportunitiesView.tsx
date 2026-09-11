import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Opportunity, StudentProfile } from "../../types";

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  onApplyOpportunity: (id: string) => void;
  onNavigateTeamMatch: () => void;
  onOpenCreateOpp?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  profile,
  onApplyOpportunity,
  onNavigateTeamMatch,
  onOpenCreateOpp,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("opp-1");

  const types = ["All", "Hackathon", "Internship", "Workshop", "Competition"];

  const filtered = opportunities.filter((opp) => {
    const matchesType = selectedType === "All" || opp.type === selectedType;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      opp.hostOrg.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Ranked Opportunities
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Personalized Opportunity Feed
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Every match is mathematically scored against {profile.name}'s verified skillset ({profile.skills.slice(0, 4).join(", ")}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {onOpenCreateOpp && (
              <button
                type="button"
                onClick={onOpenCreateOpp}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                id="feed-post-opp-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                + Post Opportunity
              </button>
            )}
            <button
              onClick={onNavigateTeamMatch}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              Find Teammates →
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, required skills, or host organization..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === t
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-sm">
            No opportunities matched your search. Try changing your filters.
          </div>
        ) : (
          filtered.map((opp) => {
            const isExpanded = expandedId === opp.id;
            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                  className="p-5 sm:p-6 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {opp.type}
                        </span>
                        {opp.tag && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                            {opp.tag}
                          </span>
                        )}
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {opp.location} ({opp.mode})
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Deadline: {opp.deadline}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-900 leading-tight">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Hosted by {opp.hostOrg}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Match percentage gauge */}
                      <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                        <div className="text-right">
                          <div className="text-base font-black text-stone-900">
                            {opp.matchPercentage}%
                          </div>
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">
                            AI Match
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                          {opp.matchPercentage}%
                        </div>
                      </div>

                      <div className="text-stone-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Pills */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-stone-400 mr-1">
                        Required Stack:
                      </span>
                      {opp.requiredSkills.map((s) => {
                        const isMatched = opp.matchedSkills.includes(s);
                        return (
                          <span
                            key={s}
                            className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                                : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {isMatched ? `✓ ${s}` : `+ ${s}`}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApplyOpportunity(opp.id);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        opp.applied
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                      }`}
                    >
                      {opp.applied ? "Applied ✓" : "Apply to Opportunity"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Skill Gap ladder */}
                {isExpanded && (
                  <div className="bg-stone-50/70 p-5 sm:p-6 border-t border-stone-200 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        About this Opportunity
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-stone-200">
                        <span className="font-bold text-stone-700 block mb-0.5">
                          Eligibility:
                        </span>
                        <span className="text-stone-600">{opp.eligibility}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-stone-200">
                        <span className="font-bold text-stone-700 block mb-0.5">
                          Perks & Awards:
                        </span>
                        <span className="text-stone-600">
                          {opp.perks?.join(" · ") || "Certificate of participation, networking"}
                        </span>
                      </div>
                    </div>

                    {/* Skill Gap Section */}
                    {opp.missingSkills.length > 0 ? (
                      <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                            How to reach 100% Match:
                          </span>
                          <span className="text-xs font-bold text-amber-700">
                            {opp.missingSkills.length} missing skill(s)
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">
                          To make your profile unbeatable for {opp.title}, build a mini-repo demonstrating:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {opp.missingSkills.map((ms) => (
                            <span
                              key={ms}
                              className="bg-white px-3 py-1 rounded-lg border border-amber-300 text-xs font-semibold text-amber-900 shadow-2xs"
                            >
                              Push project with: {ms} (+{Math.round((100 - opp.matchPercentage) / opp.missingSkills.length)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        You have 100% skill alignment for this opportunity! Your application will be prioritized.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
