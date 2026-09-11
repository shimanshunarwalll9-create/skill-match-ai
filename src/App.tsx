import React, { useState } from "react";
import {
  StudentProfile,
  OrganizerProfile,
  UserRole,
  Opportunity,
  AchievementBadge,
  TeammateCandidate,
  NotificationItem,
  GrowthMetrics,
} from "./types";
import {
  initialStudentProfile,
  initialOrganizerProfile,
  mockOpportunities,
  mockBadges,
  mockTeammates,
  initialNotifications,
  growthMetrics,
} from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { AuthView } from "./components/auth/AuthView";
import { StudentHome } from "./components/student/StudentHome";
import { OpportunitiesView } from "./components/student/OpportunitiesView";
import { TeamMatchView } from "./components/student/TeamMatchView";
import { GrowthDashboardView } from "./components/student/GrowthDashboardView";
import { AICareerAssistantView } from "./components/student/AICareerAssistantView";
import { OrganizerDashboardView } from "./components/organizer/OrganizerDashboardView";
import { EcosystemModal } from "./components/EcosystemModal";

export default function App() {
  // Authentication & Persona state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default logged in as Rahul for instant preview, can log out anytime
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [studentUser, setStudentUser] = useState<StudentProfile>(initialStudentProfile);
  const [organizerUser, setOrganizerUser] = useState<OrganizerProfile>(initialOrganizerProfile);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Dynamic opportunities & data state
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [badges, setBadges] = useState<AchievementBadge[]>(mockBadges);
  const [teammates, setTeammates] = useState<TeammateCandidate[]>(mockTeammates);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [growth, setGrowth] = useState<GrowthMetrics>(growthMetrics);

  // Modals & Drawers
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);

  // Handlers
  const handleLoginSuccess = (role: UserRole, user: StudentProfile | OrganizerProfile) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    if (role === "student") {
      setStudentUser(user as StudentProfile);
      setCurrentTab("home");
    } else {
      setOrganizerUser(user as OrganizerProfile);
      setCurrentTab("organizer_home");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "student") {
      setCurrentTab("home");
    } else {
      setCurrentTab("organizer_home");
    }
  };

  const handleApplyOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, applied: true } : opp))
    );
    setGrowth((prev) => ({
      ...prev,
      applications: prev.applications + 1,
    }));
    // Add notification
    const appliedOpp = opportunities.find((o) => o.id === id);
    if (appliedOpp) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Application Sent: ${appliedOpp.title}`,
          body: `Your profile has been forwarded to ${appliedOpp.hostOrg}. Review status in My Growth.`,
          timestamp: "Just now",
          unread: true,
          category: "application",
          linkTab: "growth",
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateProfileStrength = (newScore: number, github: string) => {
    setStudentUser((prev) => ({
      ...prev,
      profileStrength: newScore,
      githubUrl: github,
      readinessBreakdown: {
        ...prev.readinessBreakdown,
        profileCompleteness: 98,
        projects: Math.min(100, prev.readinessBreakdown.projects + 12),
      },
      careerReadiness: Math.min(100, prev.careerReadiness + 6),
    }));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Profile Strength Boosted! 🚀",
        body: `Your profile strength is now ${newScore}%. Match scores recalculated.`,
        timestamp: "Just now",
        unread: true,
        category: "system",
        linkTab: "home",
      },
      ...prev,
    ]);
  };

  const handleInviteTeammate = (candidateId: string) => {
    setTeammates((prev) =>
      prev.map((t) => (t.id === candidateId ? { ...t, invited: true } : t))
    );
    const candidate = teammates.find((t) => t.id === candidateId);
    if (candidate) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Teammate Invitation Sent to ${candidate.name}`,
          body: `Invitation sent with ${candidate.compatibility}% compatibility. They will be notified via campus portal.`,
          timestamp: "Just now",
          unread: true,
          category: "team",
          linkTab: "teammatch",
        },
        ...prev,
      ]);
    }
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Event Broadcasted: ${newOpp.title}`,
        body: `AI matched and notified 96 students with relevant skill alignments.`,
        timestamp: "Just now",
        unread: true,
        category: "match",
        linkTab: "organizer_home",
      },
      ...prev,
    ]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // If not authenticated, render 2-step intelligent onboarding / login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans">
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          defaultStudent={studentUser}
          defaultOrganizer={organizerUser}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (notificationsOpen) setNotificationsOpen(false);
      }}
      className="min-h-screen bg-stone-100/60 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900"
    >
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onSwitchRole={handleSwitchRole}
        notifications={notifications}
        notificationsOpen={notificationsOpen}
        onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenEcosystem={() => setIsEcosystemOpen(true)}
        userName={currentRole === "student" ? studentUser.name : organizerUser.orgName}
        onLogout={handleLogout}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentRole === "student" ? (
          <>
            {currentTab === "home" && (
              <StudentHome
                profile={studentUser}
                opportunities={opportunities}
                growth={growth}
                onNavigateTab={setCurrentTab}
                onUpdateProfileStrength={handleUpdateProfileStrength}
                onApplyOpportunity={handleApplyOpportunity}
              />
            )}

            {currentTab === "opportunities" && (
              <OpportunitiesView
                opportunities={opportunities}
                profile={studentUser}
                onApplyOpportunity={handleApplyOpportunity}
                onNavigateTeamMatch={() => setCurrentTab("teammatch")}
              />
            )}

            {currentTab === "teammatch" && (
              <TeamMatchView
                profile={studentUser}
                opportunities={opportunities}
                teammates={teammates}
                onInviteTeammate={handleInviteTeammate}
              />
            )}

            {currentTab === "growth" && (
              <GrowthDashboardView
                profile={studentUser}
                badges={badges}
                growth={growth}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === "assistant" && (
              <AICareerAssistantView profile={studentUser} />
            )}
          </>
        ) : (
          <>
            {(currentTab === "organizer_home" || currentTab === "organizer_create") && (
              <OrganizerDashboardView
                organizer={organizerUser}
                opportunities={opportunities}
                onAddOpportunity={handleAddOpportunity}
              />
            )}
          </>
        )}
      </main>

      {/* Ecosystem Interactive Modal */}
      <EcosystemModal
        isOpen={isEcosystemOpen}
        onClose={() => setIsEcosystemOpen(false)}
        onNavigateTab={setCurrentTab}
      />
    </div>
  );
}
