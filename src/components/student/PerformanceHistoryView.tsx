import React, { useState } from "react";
import {
  Trophy,
  Award,
  TrendingUp,
  Plus,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  BarChart3,
  Star,
  ExternalLink,
  Filter,
} from "lucide-react";
import { PerformanceRecord, PerformanceCategory } from "../../types";

interface PerformanceHistoryViewProps {
  records: PerformanceRecord[];
  onAddRecord: (newRecord: Omit<PerformanceRecord, "id">) => void;
}

export const PerformanceHistoryView: React.FC<PerformanceHistoryViewProps> = ({
  records,
  onAddRecord,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New record form
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState<PerformanceCategory>("Hackathon");
  const [score, setScore] = useState(88);
  const [rank, setRank] = useState("#8 Finalist");
  const [date, setDate] = useState("Oct 2026");
  const [organizer, setOrganizer] = useState("Open Tech Society");
  const [badge, setBadge] = useState("Finalist Award");
  const [notes, setNotes] = useState("");

  const categories: (PerformanceCategory | "all")[] = [
    "all",
    "Hackathon",
    "Competition",
    "Assessment",
    "Internship",
    "Course",
    "Project",
  ];

  const filteredRecords = records.filter(
    (r) => selectedCategory === "all" || r.category === selectedCategory
  );

  const avgScore = Math.round(
    records.reduce((sum, r) => sum + r.score, 0) / (records.length || 1)
  );

  // Performance progression chart data
  const monthlyProgression = [
    { month: "Jan", score: 64 },
    { month: "Feb", score: 68 },
    { month: "Mar", score: 72 },
    { month: "Apr", score: 76 },
    { month: "May", score: 81 },
    { month: "Jun", score: 85 },
    { month: "Jul", score: 84 },
    { month: "Aug", score: 89 },
    { month: "Sep", score: 92 },
  ];

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim()) {
      onAddRecord({
        activity: activity.trim(),
        category,
        score,
        rank,
        date,
        status: "Completed",
        organizerOrHost: organizer,
        verifiedBadge: badge,
        notes,
      });
      setActivity("");
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Verified Milestone Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Participation & Performance History
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              Historical ledger of hackathon sprints, code assessments, and team competitions that power your verified SkillMatch credentials.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs self-start lg:self-center"
          >
            <Plus className="w-3.5 h-3.5" /> Log New Achievement
          </button>
        </div>

        {/* Analytics 4-Block Banner */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Performance Score</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{avgScore}/100</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Top 5% Cohort</div>
          </div>

          <div>
            <div className="text-[11px] text-stone-500 font-medium">Skill Growth (Annual)</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">+18%</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Verified trajectory</div>
          </div>

          <div>
            <div className="text-[11px] text-stone-500 font-medium">Strongest Competency</div>
            <div className="text-2xl font-black text-amber-700 mt-1">Python</div>
            <div className="text-[11px] text-stone-500 mt-0.5">87% index score</div>
          </div>

          <div>
            <div className="text-[11px] text-stone-500 font-medium">Primary Focus Area</div>
            <div className="text-2xl font-black text-stone-700 mt-1">Deep Learning</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">30-day plan active</div>
          </div>
        </div>

        {/* Interactive Performance Progression Chart */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Skill & Evaluation Score Progression (2026)
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Consistent Positive Trajectory
            </span>
          </div>

          {/* Simple Clean Responsive SVG Chart */}
          <div className="h-32 w-full flex items-end justify-between gap-2 pt-4 px-2 bg-stone-50/70 rounded-xl border border-stone-200">
            {monthlyProgression.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-stone-700">{item.score}%</span>
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-amber-500 hover:bg-amber-600 transition-colors"
                  style={{ height: `${(item.score / 100) * 80}%` }}
                />
                <span className="text-[10px] text-stone-400 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c
                ? "bg-stone-900 text-white shadow-2xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {c === "all" ? "All Activities" : c}
          </button>
        ))}
      </div>

      {/* 3. Performance Records Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Event / Activity</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Rank / Result</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Badge / Proof</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{rec.activity}</div>
                    <div className="text-[11px] text-stone-500">{rec.organizerOrHost}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-600">
                    {rec.category}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-amber-700">
                    {rec.score}%
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {rec.rank}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {rec.date}
                  </td>
                  <td className="py-3.5 px-4">
                    {rec.verifiedBadge ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Award className="w-3 h-3 text-amber-600" />
                        {rec.verifiedBadge}
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Log Performance Record</h3>
            <p className="text-xs text-stone-500 mb-4">
              Add verified achievements from college hackathons, code platforms, or internships.
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. CodeStorm 2026 Hackathon"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Internship">Internship</option>
                    <option value="Course">Course</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Score (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rank / Standing
                  </label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. #3 Finalist"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Oct 2026"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Organizer / Host
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. IIT Delhi ACM Chapter"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Verified Badge Label
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. National Finalist"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
