import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Plus,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  Users,
  Search,
  Zap,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { SkillScoreItem, StudentProfile, SkillCategory } from "../../types";

interface AISkillProfileViewProps {
  profile: StudentProfile;
  skillScores: SkillScoreItem[];
  onAddSkill: (skill: string, category: SkillCategory, proficiency: "Beginner" | "Intermediate" | "Advanced") => void;
  onRequestEndorsement: (skillName?: string) => void;
  onOpenResumeAnalyzer: () => void;
  onNavigateToSkillGap: () => void;
}

export const AISkillProfileView: React.FC<AISkillProfileViewProps> = ({
  profile,
  skillScores,
  onAddSkill,
  onRequestEndorsement,
  onOpenResumeAnalyzer,
  onNavigateToSkillGap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<SkillCategory>("technical");
  const [newSkillProf, setNewSkillProf] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Calculate category averages
  const categories: { key: SkillCategory | "all"; label: string }[] = [
    { key: "all", label: "All Skills" },
    { key: "technical", label: "Technical Skills" },
    { key: "frameworks", label: "Frameworks & Libraries" },
    { key: "tools", label: "Developer Tools" },
    { key: "domain", label: "Domain Knowledge" },
    { key: "soft", label: "Soft Skills" },
  ];

  const filteredSkills = skillScores.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const overallScore = Math.round(
    skillScores.reduce((acc, curr) => acc + curr.score, 0) / (skillScores.length || 1)
  );

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      onAddSkill(newSkillName.trim(), newSkillCat, newSkillProf);
      setNewSkillName("");
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & AI Summary Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-amber-600" />
              Continuous Machine Intelligence Evaluation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Your AI Skill Profile
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              SkillMatch AI benchmarks your skills against 500+ active opportunity rubrics, hackathon tracks, and enterprise engineering job standards.
            </p>
          </div>

          {/* Overall Skill Score Radial / Card */}
          <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl p-5 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-600 transition-all duration-700"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-stone-900 leading-none">
                  {overallScore}
                </span>
                <span className="text-[9px] text-stone-400 font-bold">/100</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">
                Overall SkillMatch Score
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                Top 8% for {profile.course}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {skillScores.filter((s) => s.verified).length} verified skills
              </div>
            </div>
          </div>
        </div>

        {/* AI Commentary Box */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>AI Assessment Summary:</strong> Your profile demonstrates exceptional mastery in Python (87%), Git (85%), and SQL (81%), positioning you well ahead of peers for AI/ML and Data Engineering internships. Strengthening deep learning frameworks like TensorFlow and deploying full-stack models will elevate your match to 96% across tier-1 opportunities.
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-stone-100">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Skill
          </button>
          <button
            onClick={() => onRequestEndorsement()}
            className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Request Peer Endorsement
          </button>
          <button
            onClick={onOpenResumeAnalyzer}
            className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            Analyze Full Resume
          </button>
          <button
            onClick={onNavigateToSkillGap}
            className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            View Target Skill Gaps
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* 3. Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isHigh = skill.score >= 80;
          const isMed = skill.score >= 65 && skill.score < 80;
          return (
            <div
              key={skill.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                      {skill.name}
                      {skill.verified && (
                        <span title="Peer Verified & Evaluated">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      {skill.category}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      isHigh
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : isMed
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {skill.proficiency}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-700">
                    <span>Proficiency Index</span>
                    <span className="text-stone-900 font-bold">{skill.score}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? "bg-emerald-500" : isMed ? "bg-amber-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>
                  {skill.endorsementsCount
                    ? `${skill.endorsementsCount} peer endorsement${skill.endorsementsCount > 1 ? "s" : ""}`
                    : "Self-assessed"}
                </span>
                <button
                  onClick={() => onRequestEndorsement(skill.name)}
                  className="text-amber-700 hover:text-amber-900 font-semibold text-[11px] flex items-center gap-0.5"
                >
                  Verify <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Add Skill to AI Profile</h3>
            <p className="text-xs text-stone-500 mb-4">
              The AI matching system will immediately evaluate your suitability across all cataloged opportunities.
            </p>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Docker, OpenCV"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newSkillCat}
                    onChange={(e) => setNewSkillCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="technical">Technical</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="tools">Developer Tools</option>
                    <option value="domain">Domain Knowledge</option>
                    <option value="soft">Soft Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Proficiency
                  </label>
                  <select
                    value={newSkillProf}
                    onChange={(e) => setNewSkillProf(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Beginner">Beginner (55%)</option>
                    <option value="Intermediate">Intermediate (75%)</option>
                    <option value="Advanced">Advanced (88%)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Add & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
