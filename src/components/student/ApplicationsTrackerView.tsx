import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit2,
  Trash2,
  Columns3,
  List,
} from "lucide-react";
import { ApplicationItem, ApplicationStatus } from "../../types";

interface ApplicationsTrackerViewProps {
  applications: ApplicationItem[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddApplication: (newApp: Omit<ApplicationItem, "id">) => void;
  onDeleteApplication?: (id: string) => void;
  onNavigateToOpportunities: () => void;
}

export const ApplicationsTrackerView: React.FC<ApplicationsTrackerViewProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onAddApplication,
  onDeleteApplication,
  onNavigateToOpportunities,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New application form
  const [newTitle, setNewTitle] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newType, setNewType] = useState("Hackathon");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("Applied");
  const [newDeadline, setNewDeadline] = useState("In 2 weeks");
  const [newLocation, setNewLocation] = useState("Remote");
  const [newMatchScore, setNewMatchScore] = useState(88);
  const [newNotes, setNewNotes] = useState("");

  const allStatuses: ApplicationStatus[] = [
    "Saved",
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
  ];

  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      selectedStatusFilter === "all" || app.status === selectedStatusFilter;
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newOrg.trim()) {
      onAddApplication({
        opportunityId: `custom-app-${Date.now()}`,
        title: newTitle.trim(),
        organization: newOrg.trim(),
        type: newType,
        dateApplied: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        matchScore: newMatchScore,
        status: newStatus,
        deadline: newDeadline,
        location: newLocation,
        notes: newNotes,
        mode: "Remote",
        appliedVia: "SkillMatch AI",
      });
      setNewTitle("");
      setNewOrg("");
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
              <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
              Unified Pipeline Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              My Applications
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              Monitor your active submissions, interview stages, and offers across internships, hackathons, and research grants.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {viewMode === "kanban" ? (
                <>
                  <List className="w-3.5 h-3.5" /> List View
                </>
              ) : (
                <>
                  <Columns3 className="w-3.5 h-3.5" /> Kanban View
                </>
              )}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Application
            </button>
          </div>
        </div>

        {/* Status Count Summary Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-stone-100">
          <button
            onClick={() => setSelectedStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedStatusFilter === "all"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            All ({applications.length})
          </button>
          {allStatuses.map((st) => {
            const count = applications.filter((a) => a.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedStatusFilter === st
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Controls */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by company, role, hackathon..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
      </div>

      {/* 3. Render Views */}
      {viewMode === "kanban" ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {["Applied", "Under Review", "Interview", "Selected"].map((columnStatus) => {
            const columnApps = filteredApps.filter((a) => a.status === columnStatus);
            return (
              <div
                key={columnStatus}
                className="bg-stone-100/70 rounded-2xl p-4 border border-stone-200 flex flex-col space-y-3 min-h-[400px]"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        columnStatus === "Selected"
                          ? "bg-emerald-500"
                          : columnStatus === "Interview"
                          ? "bg-purple-500"
                          : columnStatus === "Under Review"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                      {columnStatus}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    {columnApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold text-stone-500">
                            {app.type}
                          </span>
                          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {app.matchScore}% Match
                          </span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                          {app.title}
                        </h4>
                        <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-stone-400" />
                          {app.organization}
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Applied: {app.dateApplied}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {app.location || "Remote"}
                        </div>
                      </div>

                      {/* Notes Box */}
                      {app.notes && (
                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-[11px] text-stone-600 italic">
                          "{app.notes}"
                        </div>
                      )}

                      {/* Quick Status Dropdown */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            onUpdateStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="w-full text-[11px] font-semibold py-1 px-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none"
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>
                              Move: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="py-10 text-center text-xs text-stone-400">
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Opportunity & Org</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{app.title}</div>
                      <div className="text-[11px] text-stone-500">{app.organization}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-600">
                      {app.type}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {app.dateApplied}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">
                      {app.matchScore}%
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          onUpdateStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className="text-xs font-semibold py-1 px-2 rounded-lg border border-stone-200 bg-white text-stone-800"
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-stone-500">
                      {app.notes || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingNotesId(app.id);
                          setTempNotes(app.notes || "");
                        }}
                        className="text-stone-500 hover:text-stone-900 font-semibold text-[11px] mr-2"
                      >
                        Edit Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Update Application Notes</h3>
            <p className="text-xs text-stone-500 mb-3">
              Record interview dates, interviewer feedback, or prep reminders.
            </p>
            <textarea
              rows={4}
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Technical round passed. Mentor Dr. Ramesh requested code architecture diagram."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingNotesId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotes(editingNotesId)}
                className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Add Application</h3>
            <p className="text-xs text-stone-500 mb-4">
              Log an external application or hackathon submission to track in one unified pipeline.
            </p>

            <form onSubmit={handleCreateApp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Title / Role
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Research Intern"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Company / Organizer
                </label>
                <input
                  type="text"
                  required
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Google DeepMind"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Job">Job</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Competition">Competition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes / Interview Details
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Applied via referral link. Round 1 code test due next Tuesday."
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
