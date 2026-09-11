import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Zap,
} from "lucide-react";
import { StudentProfile } from "../../types";

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onResetAllData: () => void;
  onDeleteAccount: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetAllData,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(profile.name);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      careerGoal,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-stone-500">
              Manage your profile security, notifications, and platform preferences.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
          {/* Section: Account & Profile */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-600" /> Account Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Primary Email
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Career Goal
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g. AI/ML Software Engineer"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-stone-600" /> Notifications & Alerts
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    High-Match Opportunity Alerts
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Receive immediate notifications when hackathons or jobs match ≥90% with your skills.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterVisibility}
                  onChange={(e) => setRecruiterVisibility(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    Recruiter & Organizer Scouting
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Allow verified hackathon organizers and university partners to discover your profile.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-2xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Platform Reset & Demo Data Tools */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-stone-600" /> Hackathon Judge & Testing Tools
        </h3>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-950">
              Reset Application & Cache to Defaults
            </div>
            <div className="text-[11px] text-amber-800 mt-0.5">
              Restores initial seed profiles, demo applications, learning tasks, and verified skills.
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* 3. Danger Zone: Delete Account */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-stone-900">
              Delete Account & Clear All Associated Data
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Permanently removes your student profile, submitted applications, and verified peer endorsements.
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-2xs"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-red-300 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                This action cannot be undone. To confirm deletion, type <strong>DELETE</strong> below:
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteAccount();
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-amber-300 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Reset Demo Data?
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                This will reset all opportunities, skills, applications, and learning tasks to the clean hackathon demo state.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData();
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
