import React, { useState } from "react";
import {
  X,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Plus,
  Loader2,
  Tag,
  Gift,
  Send,
} from "lucide-react";
import { Opportunity, StudentProfile } from "../../types";
import { calculateOpportunityMatch } from "../../utils/matchingEngine";

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOpportunity: (opp: Opportunity) => void;
  currentStudentProfile?: StudentProfile;
  defaultHostOrg?: string;
}

export const CreateOpportunityModal: React.FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onAddOpportunity,
  currentStudentProfile,
  defaultHostOrg = "Campus Innovation Lab",
}) => {
  if (!isOpen) return null;

  // Form Fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Opportunity["type"]>("Hackathon");
  const [hostOrg, setHostOrg] = useState(defaultHostOrg);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(["Python", "Git"]);
  const [skillInput, setSkillInput] = useState("");
  const [eligibility, setEligibility] = useState("Open to all undergraduate and graduate students");
  const [deadline, setDeadline] = useState("In 14 days");
  const [location, setLocation] = useState("Remote");
  const [mode, setMode] = useState<Opportunity["mode"]>("Remote");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState<string[]>(["Certificate", "Mentorship"]);
  const [perkInput, setPerkInput] = useState("");

  // AI Copilot state
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotText, setCopilotText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !requiredSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setRequiredSkills([...requiredSkills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleAddPerk = (perk: string) => {
    const trimmed = perk.trim();
    if (trimmed && !perks.includes(trimmed)) {
      setPerks([...perks, trimmed]);
    }
    setPerkInput("");
  };

  const handleRemovePerk = (perk: string) => {
    setPerks(perks.filter((p) => p !== perk));
  };

  const handleRunAICopilot = async () => {
    if (!copilotText.trim()) return;
    setIsExtracting(true);

    try {
      const res = await fetch("/api/ai/extract-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: copilotText }),
      });
      const data = await res.json();
      if (data) {
        if (data.title) setTitle(data.title);
        if (data.type) setType(data.type);
        if (Array.isArray(data.requiredSkills)) {
          setRequiredSkills(data.requiredSkills);
        }
        if (data.eligibility) setEligibility(data.eligibility);
        if (data.summary) setDescription(data.summary);
      }
    } catch (e) {
      console.error("AI extraction error:", e);
    } finally {
      setIsExtracting(false);
      setShowCopilot(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate match against current student if available
    const userSkills = currentStudentProfile?.skills || [];
    const match = calculateOpportunityMatch(userSkills, requiredSkills, currentStudentProfile?.interests);

    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: title.trim(),
      type,
      hostOrg: hostOrg.trim() || "Independent Host",
      matchPercentage: match.matchPercentage,
      requiredSkills,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      eligibility,
      deadline,
      location,
      mode,
      description:
        description.trim() ||
        "Exciting opportunity tailored for aspiring engineering talent. Apply now to participate.",
      tag: "Live Opportunity",
      perks,
      applied: false,
      createdByUser: true,
    };

    onAddOpportunity(newOpportunity);
    onClose();
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
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Post Real Opportunity
              </h2>
              <p className="text-xs text-stone-500">
                Create a live hackathon, internship, workshop, or competition.
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

        {/* AI Copilot Toggle Banner */}
        <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Have an event flyer or text description? Let AI extract the details.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCopilot(!showCopilot)}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
          >
            {showCopilot ? "Hide Copilot" : "Use AI Copilot"}
          </button>
        </div>

        {/* Copilot Drawer */}
        {showCopilot && (
          <div className="p-6 bg-amber-50/40 border-b border-amber-200 space-y-3 animate-in slide-in-from-top-2">
            <label className="block text-xs font-semibold text-stone-700">
              Paste event text, website snippet, or brochure text:
            </label>
            <textarea
              rows={3}
              value={copilotText}
              onChange={(e) => setCopilotText(e.target.value)}
              placeholder="e.g. We are organizing a 48h National Hackathon on Cloud Security & DevOps. Looking for Python, Kubernetes, and Docker skills..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleRunAICopilot}
                disabled={isExtracting}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Extracting fields...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Fill Form with Gemini
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Global Web3 Hackathon 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Opportunity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Internship">Internship</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Host Organization
              </label>
              <input
                type="text"
                value={hostOrg}
                onChange={(e) => setHostOrg(e.target.value)}
                placeholder="e.g. NextGen Tech Labs"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Location & Deadline
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Deadline"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Required Technical Skills *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type skill (e.g. React, Docker, Python) and press Enter..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200 min-h-12 items-center">
              {requiredSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-xs font-semibold"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility & Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Eligibility
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. Open to all students & recent graduates"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Description & Challenge Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity, rounds, tracks, or role responsibilities..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          {/* Perks / Prizes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Perks, Prizes & Incentives
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={perkInput}
                onChange={(e) => setPerkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPerk(perkInput);
                  }
                }}
                placeholder="e.g. $10,000 Prize Pool, Cloud Credits, Certificate..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddPerk(perkInput)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
              {perks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold"
                >
                  <Gift className="w-3 h-3 text-emerald-600" />
                  {p}
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(p)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Publish Opportunity Live
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
