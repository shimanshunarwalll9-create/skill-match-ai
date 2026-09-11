import React from "react";
import {
  Bell,
  Sparkles,
  Users,
  Compass,
  TrendingUp,
  Bot,
  Building2,
  GraduationCap,
  LogOut,
  Network,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { UserRole, NotificationItem } from "../types";
import { User, Plus, RotateCcw } from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onSwitchRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  notificationsOpen: boolean;
  onMarkNotificationRead: (id: string) => void;
  onOpenEcosystem: () => void;
  userName: string;
  userEmail?: string;
  emailVerified?: boolean;
  onLogout: () => void;
  onOpenProfileEditor?: () => void;
  onOpenCreateOpp?: () => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  onSwitchRole,
  notifications,
  onOpenNotifications,
  notificationsOpen,
  onMarkNotificationRead,
  onOpenEcosystem,
  userName,
  userEmail,
  emailVerified = true,
  onLogout,
  onOpenProfileEditor,
  onOpenCreateOpp,
  onResetData,
}) => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab(currentRole === "student" ? "home" : "organizer_home")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              id="nav-logo-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 tracking-tight text-lg">
                    SkillMatch
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Intelligent Opportunity Matching
                </p>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {currentRole === "student" ? (
                <>
                  <button
                    onClick={() => onSelectTab("home")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "home"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-home"
                  >
                    <Compass className="w-4 h-4" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => onSelectTab("opportunities")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "opportunities"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-opps"
                  >
                    <Sparkles className="w-4 h-4" />
                    Top Matches
                  </button>

                  <button
                    onClick={() => onSelectTab("teammatch")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "teammatch"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-teammatch"
                  >
                    <Users className="w-4 h-4" />
                    TeamMatch
                    <span className="text-[10px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      AI
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectTab("growth")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "growth"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-growth"
                  >
                    <TrendingUp className="w-4 h-4" />
                    My Growth
                  </button>

                  <button
                    onClick={() => onSelectTab("assistant")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "assistant"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-assistant"
                  >
                    <Bot className="w-4 h-4 text-amber-500" />
                    Career Assistant
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onSelectTab("organizer_home")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "organizer_home"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-org-overview"
                  >
                    <Building2 className="w-4 h-4" />
                    Organizer Hub
                  </button>
                  <button
                    onClick={() => onSelectTab("organizer_create")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentTab === "organizer_create"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-org-create"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Opportunity (AI)
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Ecosystem Map View trigger */}
            <button
              onClick={onOpenEcosystem}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors"
              title="View the complete SkillMatch AI Ecosystem Diagram"
              id="nav-ecosystem-btn"
            >
              <Network className="w-3.5 h-3.5 text-amber-700" />
              Ecosystem Story
            </button>

            {/* Quick Persona Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-xs">
              <button
                onClick={() => onSwitchRole("student")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  currentRole === "student"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Switch to Student Mode"
                id="role-switch-student"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                onClick={() => onSwitchRole("organizer")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  currentRole === "organizer"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Switch to Organizer Mode"
                id="role-switch-organizer"
              >
                <Building2 className="w-3.5 h-3.5" />
                Organizer
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200 bg-white"
                aria-label="Notifications"
                id="nav-bell-btn"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  id="notifications-dropdown"
                >
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">
                        Personalized Feed & Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">SkillMatch AI</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-stone-500">
                        No notifications yet. New matches and team alerts appear here.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onMarkNotificationRead(item.id);
                            if (item.linkTab) onSelectTab(item.linkTab);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors text-left ${
                            item.unread ? "bg-amber-50/70 hover:bg-amber-100/50" : "hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`text-xs font-semibold ${
                                item.unread ? "text-stone-900" : "text-stone-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-stone-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {item.body}
                          </p>
                          {item.unread && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium mt-1">
                              <CheckCircle2 className="w-3 h-3" /> Tap to view details
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile avatar & actions */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
              {currentRole === "student" && onOpenProfileEditor && (
                <button
                  onClick={onOpenProfileEditor}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                  title="Edit your real profile, skills, and resume"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Profile
                </button>
              )}

              {onOpenCreateOpp && (
                <button
                  onClick={onOpenCreateOpp}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
                  title="Post a live opportunity or hackathon"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post Opp
                </button>
              )}

              <div className="relative">
                <button
                  onClick={currentRole === "student" && onOpenProfileEditor ? onOpenProfileEditor : undefined}
                  className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer"
                  title={`${userName} (${userEmail || "Verified"})${currentRole === "student" ? " - Click to edit profile" : ""}`}
                >
                  {userName.charAt(0)}
                </button>
                {emailVerified && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-white"
                    title="Email address is verified"
                  >
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {onResetData && (
                <button
                  onClick={onResetData}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Reset to clean defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                title="Log out / Switch User"
                id="nav-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="flex md:hidden overflow-x-auto gap-2 py-2 border-t border-stone-100 text-xs no-scrollbar">
          {currentRole === "student" ? (
            <>
              <button
                onClick={() => onSelectTab("home")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "home" ? "bg-stone-900 text-white font-medium" : "text-stone-600"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectTab("opportunities")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "opportunities"
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-600"
                }`}
              >
                Top Matches
              </button>
              <button
                onClick={() => onSelectTab("teammatch")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "teammatch"
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-600"
                }`}
              >
                TeamMatch
              </button>
              <button
                onClick={() => onSelectTab("growth")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "growth" ? "bg-stone-900 text-white font-medium" : "text-stone-600"
                }`}
              >
                My Growth
              </button>
              <button
                onClick={() => onSelectTab("assistant")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "assistant"
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-600"
                }`}
              >
                AI Assistant
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectTab("organizer_home")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "organizer_home"
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-600"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => onSelectTab("organizer_create")}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  currentTab === "organizer_create"
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-600"
                }`}
              >
                Create Event
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
