import React, { useState } from "react";
import { X, Award, Calendar, CheckCircle2, TrendingUp, Sparkles, Tag } from "lucide-react";

interface LogAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogEvent: (event: {
    title: string;
    type: string;
    outcome: string;
    skillsUsed: string[];
    date: string;
  }) => void;
}

export const LogAchievementModal: React.FC<LogAchievementModalProps> = ({
  isOpen,
  onClose,
  onLogEvent,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Hackathon");
  const [outcome, setOutcome] = useState("Finalist / Honorable Mention");
  const [skillsInput, setSkillsInput] = useState("");
  const [date, setDate] = useState("Recent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onLogEvent({
      title: title.trim(),
      type,
      outcome,
      skillsUsed: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      date,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Log Real Milestone</h3>
              <p className="text-[11px] text-stone-500">
                Boosts your Career Readiness Score & verification history.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Event or Project Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart India Hackathon / Open Source Fellowship"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Project">Shipped Project</option>
                <option value="Internship">Internship</option>
                <option value="Workshop">Workshop</option>
                <option value="Certification">Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Outcome / Award
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Winner (1st Place)">Winner (1st Place)</option>
                <option value="Top 3 / Runner Up">Top 3 / Runner Up</option>
                <option value="Finalist / Top 10">Finalist / Top 10</option>
                <option value="Completed & Shipped">Completed & Shipped</option>
                <option value="Participated">Participated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Skills Demonstrated (comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, Docker, React, FastAPI"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Date / Timeline
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. November 2025"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
            >
              Log & Boost Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
