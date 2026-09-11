import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  UserCheck,
  Send,
  Sparkles,
  Users,
  FolderGit2,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";
import { StudentProfile, SkillEndorsement } from "../../types";
import { getSkillVerification } from "../../utils/matchingEngine";

interface RequestEndorsementModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  initialSkill?: string;
  onRequestSubmitted: (endorsement: SkillEndorsement, autoApprove?: boolean) => void;
}

export const RequestEndorsementModal: React.FC<RequestEndorsementModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialSkill,
  onRequestSubmitted,
}) => {
  if (!isOpen) return null;

  // Form states
  const [selectedSkill, setSelectedSkill] = useState<string>(
    initialSkill || profile.skills?.[0] || "Python"
  );
  const [customSkill, setCustomSkill] = useState("");

  // Collaborator selection
  const predefinedCollaborators = [
    {
      name: "Simran Kaur",
      role: "Frontend & UI Lead",
      project: "Smart India Hackathon 2025",
      relationship: "teammate" as const,
      avatar: "",
    },
    {
      name: "Amit Verma",
      role: "Systems & DevOps Engineer",
      project: "AI/ML Hackathon 2026",
      relationship: "teammate" as const,
      avatar: "",
    },
    {
      name: "Neha Gupta",
      role: "Data Science Lead",
      project: "Generative AI Bootcamp",
      relationship: "collaborator" as const,
      avatar: "",
    },
    {
      name: "Devon Vance",
      role: "Full-Stack Engineer",
      project: "Campus Web Sprint",
      relationship: "peer" as const,
      avatar: "",
    },
  ];

  const [collaboratorMode, setCollaboratorMode] = useState<"preset" | "custom">("preset");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const [customCollaboratorName, setCustomCollaboratorName] = useState("");
  const [customCollaboratorRole, setCustomCollaboratorRole] = useState("Hackathon Teammate");
  const [customCollaboratorEmail, setCustomCollaboratorEmail] = useState("");

  // Project context
  const predefinedProjects = [
    "AI/ML Hackathon 2026",
    "Smart India Hackathon 2025",
    "Autonomous Agent Evaluator (Capstone)",
    "Generative AI Bootcamp",
    "Campus Web Sprint",
    "Other Project / Hackathon",
  ];
  const [selectedProject, setSelectedProject] = useState(predefinedProjects[0]);
  const [customProjectName, setCustomProjectName] = useState("");

  const [relationship, setRelationship] = useState<"teammate" | "collaborator" | "lead" | "peer">(
    "teammate"
  );

  const activeSkill = customSkill.trim() || selectedSkill;

  // Personal message
  const [personalMessage, setPersonalMessage] = useState(
    `Hey! We worked together on our hackathon project. Would you be willing to endorse my ${activeSkill} skills on SkillMatch AI to verify my contribution?`
  );

  const [instantSimulateApproval, setInstantSimulateApproval] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check current verification status of this skill
  const currentVerification = getSkillVerification(activeSkill, profile.endorsements || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSkill) return;

    setSubmitting(true);

    const collaboratorName =
      collaboratorMode === "preset"
        ? predefinedCollaborators[selectedPresetIndex].name
        : customCollaboratorName.trim() || "Teammate Collaborator";

    const collaboratorRole =
      collaboratorMode === "preset"
        ? predefinedCollaborators[selectedPresetIndex].role
        : customCollaboratorRole.trim() || "Hackathon Collaborator";

    const projectName =
      selectedProject === "Other Project / Hackathon"
        ? customProjectName.trim() || "Collaborative Project"
        : selectedProject;

    const newEndorsement: SkillEndorsement = {
      id: `end-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      skill: activeSkill,
      endorserName: collaboratorName,
      endorserRole: collaboratorRole,
      projectOrEvent: projectName,
      relationship: relationship,
      comment: instantSimulateApproval
        ? `Consistently delivered reliable, high-performance ${activeSkill} code throughout the project sprint. Highly recommended collaborator!`
        : personalMessage,
      status: instantSimulateApproval ? "verified" : "pending",
      requestedAt: "Just now",
      verifiedAt: instantSimulateApproval ? "Just now" : undefined,
      proficiencyRating: instantSimulateApproval ? 5 : undefined,
    };

    setTimeout(() => {
      onRequestSubmitted(newEndorsement, instantSimulateApproval);
      setSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Request Skill Endorsement
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Verified Trust Badge
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Ask past teammates or project collaborators to vouch for your real contributions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Skill Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
              <span>1. Select Skill to Verify</span>
              {currentVerification.isVerified ? (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 normal-case">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Currently verified ({currentVerification.count} endorsements)
                </span>
              ) : currentVerification.pendingCount > 0 ? (
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 normal-case">
                  <Clock className="w-3.5 h-3.5" />
                  Request already pending
                </span>
              ) : null}
            </label>

            {/* Quick skill pills */}
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((s) => {
                const isSelected = selectedSkill === s && !customSkill;
                const v = getSkillVerification(s, profile.endorsements || []);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSkill(s);
                      setCustomSkill("");
                      setPersonalMessage(
                        `Hey! We worked together on our hackathon project. Would you be willing to endorse my ${s} skills on SkillMatch AI to verify my contribution?`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/20"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span>{s}</span>
                    {v.isVerified && (
                      <ShieldCheck
                        className={`w-3 h-3 ${isSelected ? "text-white" : "text-emerald-600"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Or custom skill */}
            <div className="pt-1">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => {
                  setCustomSkill(e.target.value);
                  if (e.target.value) {
                    setPersonalMessage(
                      `Hey! We worked together on our hackathon project. Would you be willing to endorse my ${e.target.value} skills on SkillMatch AI to verify my contribution?`
                    );
                  }
                }}
                placeholder="Or type another skill (e.g. Next.js, Kubernetes, LangChain)..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Choose Collaborator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Choose Teammate or Collaborator
              </label>
              <div className="flex rounded-lg border border-stone-200 p-0.5 bg-stone-50 text-xs">
                <button
                  type="button"
                  onClick={() => setCollaboratorMode("preset")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    collaboratorMode === "preset"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Past Teammates
                </button>
                <button
                  type="button"
                  onClick={() => setCollaboratorMode("custom")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    collaboratorMode === "custom"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Custom Peer
                </button>
              </div>
            </div>

            {collaboratorMode === "preset" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {predefinedCollaborators.map((collab, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  return (
                    <div
                      key={collab.name}
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        setSelectedProject(collab.project);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/10 shadow-2xs"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-xs shrink-0 border border-stone-200">
                        {collab.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {collab.name}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">{collab.role}</div>
                        <div className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">
                          📍 {collab.project}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Collaborator Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCollaboratorName}
                      onChange={(e) => setCustomCollaboratorName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Their Role on Team
                    </label>
                    <input
                      type="text"
                      value={customCollaboratorRole}
                      onChange={(e) => setCustomCollaboratorRole(e.target.value)}
                      placeholder="e.g. Backend Lead, Co-developer"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Email or Campus ID (Optional)
                  </label>
                  <input
                    type="email"
                    value={customCollaboratorEmail}
                    onChange={(e) => setCustomCollaboratorEmail(e.target.value)}
                    placeholder="teammate@university.edu"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Project & Collaboration Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Shared Project or Event
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-stone-800"
              >
                {predefinedProjects.map((proj) => (
                  <option key={proj} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
              {selectedProject === "Other Project / Hackathon" && (
                <input
                  type="text"
                  value={customProjectName}
                  onChange={(e) => setCustomProjectName(e.target.value)}
                  placeholder="Enter hackathon or project name..."
                  className="w-full mt-1.5 px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Working Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) =>
                  setRelationship(
                    e.target.value as "teammate" | "collaborator" | "lead" | "peer"
                  )
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-stone-800"
              >
                <option value="teammate">Hackathon Teammate</option>
                <option value="collaborator">Project Co-developer</option>
                <option value="lead">Project / Tech Lead</option>
                <option value="peer">Academic / Lab Peer</option>
              </select>
            </div>
          </div>

          {/* 4. Request Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
              <span>Personal Request Note</span>
              <span className="text-[11px] text-stone-400 font-normal">Sent to collaborator</span>
            </label>
            <textarea
              rows={3}
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed text-stone-800"
            />
          </div>

          {/* 5. Live Badge Preview & Instant Simulation Option */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-950">
                  Profile Badge Preview Upon Verification
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Recruiter Proof
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-bold shadow-2xs">
                <span>{activeSkill}</span>
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-1">
                "Verified by {collaboratorMode === "preset" ? predefinedCollaborators[selectedPresetIndex].name : customCollaboratorName || "Collaborator"} ({selectedProject})"
              </p>
            </div>

            {/* Instant Test Approval Toggle */}
            <div className="pt-1 flex items-center justify-between border-t border-emerald-200/60">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantSimulateApproval}
                  onChange={(e) => setInstantSimulateApproval(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-emerald-950">
                  ⚡ Simulate Instant Partner Approval (Demo Mode)
                </span>
              </label>
              <span className="text-[10px] text-emerald-700 font-medium">
                Immediately awards badge to profile
              </span>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !activeSkill}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            id="submit-endorsement-request-btn"
          >
            {instantSimulateApproval ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                Simulate & Verify Badge
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Send Endorsement Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
