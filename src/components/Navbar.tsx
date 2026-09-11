import React, { useState } from "react";
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
  Brain,
  Target,
  BookOpen,
  ClipboardList,
  Trophy,
  Award,
  Settings,
  ChevronDown,
  User,
  Plus,
  RotateCcw,
} from "lucide-react";
import { UserRole, NotificationItem } from "../types";

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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
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
            <nav className="hidden xl:flex items-center gap-1">
              {currentRole === "student" ? (
                <>
                  <button
                    onClick={() => onSelectTab("home")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "home"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-home"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => onSelectTab("opportunities")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "opportunities"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-opps"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Opportunities
                  </button>

                  <button
                    onClick={() => onSelectTab("skill_profile")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "skill_profile"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-skill-profile"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    Skill Profile
                  </button>

                  <button
                    onClick={() => onSelectTab("skill_gap")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "skill_gap"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-skill-gap"
                  >
                    <Target className="w-3.5 h-3.5" />
                    Skill Gap
                  </button>

                  <button
                    onClick={() => onSelectTab("learning_plan")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "learning_plan"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-learning-plan"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Learning Plan
                  </button>

                  <button
                    onClick={() => onSelectTab("applications")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentTab === "applications"
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                    id="nav-student-applications"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Applications
                  </button>

                  {/* More Features Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        ["performance", "achievements", "assistant", "teammatch", "growth", "settings"].includes(currentTab)
                          ? "bg-stone-900 text-white"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                    >
                      <span>More</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {moreMenuOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                        <button
                          onClick={() => {
                            onSelectTab("performance");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Trophy className="w-3.5 h-3.5 text-amber-600" />
                          Performance History
                        </button>

                        <button
                          onClick={() => {
                            onSelectTab("achievements");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          Achievements & XP
                        </button>

                        <button
                          onClick={() => {
                            onSelectTab("assistant");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Bot className="w-3.5 h-3.5 text-purple-600" />
                          AI Career Assistant
                        </button>

                        <button
                          onClick={() => {
                            onSelectTab("teammatch");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          TeamMatch AI
                        </button>

                        <button
                          onClick={() => {
                            onSelectTab("growth");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                          Growth & Readiness
                        </button>

                        <div className="border-t border-stone-100 my-1" />

                        <button
                          onClick={() => {
                            onSelectTab("settings");
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Settings className="w-3.5 h-3.5 text-stone-500" />
                          Settings & Preferences
                        </button>
                      </div>
                    )}
                  </div>
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

        {/* Sub-bar / Quick Category Switcher */}
        <div className="flex overflow-x-auto gap-1.5 py-2 border-t border-stone-100 text-xs no-scrollbar">
          {currentRole === "student" ? (
            <>
              {[
                { id: "home", label: "Dashboard", icon: Compass },
                { id: "opportunities", label: "Opportunities", icon: Sparkles },
                { id: "skill_profile", label: "Skill Profile", icon: Brain },
                { id: "skill_gap", label: "Skill Gap", icon: Target },
                { id: "learning_plan", label: "Learning Plan", icon: BookOpen },
                { id: "applications", label: "Applications", icon: ClipboardList },
                { id: "performance", label: "Performance", icon: Trophy },
                { id: "achievements", label: "Achievements", icon: Award },
                { id: "assistant", label: "AI Assistant", icon: Bot },
                { id: "teammatch", label: "TeamMatch", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? "bg-stone-900 text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectTab("organizer_home")}
                className={`px-3 py-1.5 rounded-xl shrink-0 text-xs font-semibold flex items-center gap-1.5 ${
                  currentTab === "organizer_home"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Organizer Hub
              </button>
              <button
                onClick={() => onSelectTab("organizer_create")}
                className={`px-3 py-1.5 rounded-xl shrink-0 text-xs font-semibold flex items-center gap-1.5 ${
                  currentTab === "organizer_create"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Create Opportunity
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
