import React, { useState, useEffect } from "react";
import {
  StudentProfile,
  OrganizerProfile,
  UserRole,
  Opportunity,
  AchievementBadge,
  TeammateCandidate,
  NotificationItem,
  GrowthMetrics,
  SkillEndorsement,
  PeerEndorsementRequest,
  ApplicationItem,
  ApplicationStatus,
  PerformanceRecord,
  LearningTask,
  SkillScoreItem,
  SkillCategory,
} from "./types";
import {
  loadStoredStudent,
  saveStoredStudent,
  loadStoredOrganizer,
  saveStoredOrganizer,
  loadStoredOpportunities,
  saveStoredOpportunities,
  loadStoredBadges,
  saveStoredBadges,
  loadStoredTeammates,
  saveStoredTeammates,
  loadStoredNotifications,
  saveStoredNotifications,
  loadStoredGrowth,
  saveStoredGrowth,
  loadStoredRole,
  saveStoredRole,
  loadStoredEndorsements,
  saveStoredEndorsements,
  loadStoredPeerRequests,
  saveStoredPeerRequests,
  loadStoredAuthState,
  saveStoredAuthState,
  saveActiveUser,
  resetAllStorage,
  loadStoredApplications,
  saveStoredApplications,
  loadStoredPerformanceRecords,
  saveStoredPerformanceRecords,
  loadStoredLearningPlan,
  saveStoredLearningPlan,
  loadStoredSkillScores,
  saveStoredSkillScores,
  loadStoredXP,
  saveStoredXP,
} from "./utils/storage";
import {
  calculateProfileStrength,
  calculateCareerReadiness,
  recalculateAllOpportunities,
} from "./utils/matchingEngine";
import { Navbar } from "./components/Navbar";
import { AuthView } from "./components/auth/AuthView";
import { LandingPage } from "./components/landing/LandingPage";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { StudentHome } from "./components/student/StudentHome";
import { OpportunitiesView } from "./components/student/OpportunitiesView";
import { TeamMatchView } from "./components/student/TeamMatchView";
import { GrowthDashboardView } from "./components/student/GrowthDashboardView";
import { AICareerAssistantView } from "./components/student/AICareerAssistantView";
import { AISkillProfileView } from "./components/student/AISkillProfileView";
import { ExplainableMatchModal } from "./components/student/ExplainableMatchModal";
import { SkillGapAnalyzerView } from "./components/student/SkillGapAnalyzerView";
import { LearningPlanView } from "./components/student/LearningPlanView";
import { ApplicationsTrackerView } from "./components/student/ApplicationsTrackerView";
import { PerformanceHistoryView } from "./components/student/PerformanceHistoryView";
import { AchievementsView } from "./components/student/AchievementsView";
import { ResumeAnalyzerModal } from "./components/student/ResumeAnalyzerModal";
import { SettingsView } from "./components/student/SettingsView";
import { OrganizerDashboardView } from "./components/organizer/OrganizerDashboardView";
import { EcosystemModal } from "./components/EcosystemModal";
import { ProfileEditorModal } from "./components/student/ProfileEditorModal";
import { CreateOpportunityModal } from "./components/organizer/CreateOpportunityModal";
import { LogAchievementModal } from "./components/student/LogAchievementModal";
import { RequestEndorsementModal } from "./components/student/RequestEndorsementModal";
import { SkillVerificationModal } from "./components/student/SkillVerificationModal";

export default function App() {
  // Authentication & Persona state with real persistence
  // Opens directly with Login / Sign Up interface by default
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadStoredAuthState());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadStoredRole());
  const [studentUser, setStudentUser] = useState<StudentProfile>(() => loadStoredStudent());
  const [organizerUser, setOrganizerUser] = useState<OrganizerProfile>(() => loadStoredOrganizer());

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Dynamic opportunities & data state with real persistence
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const rawOpps = loadStoredOpportunities();
    const student = loadStoredStudent();
    return recalculateAllOpportunities(rawOpps, student);
  });
  const [badges, setBadges] = useState<AchievementBadge[]>(() => loadStoredBadges());
  const [teammates, setTeammates] = useState<TeammateCandidate[]>(() => loadStoredTeammates());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStoredNotifications());
  const [growth, setGrowth] = useState<GrowthMetrics>(() => loadStoredGrowth());
  const [peerRequests, setPeerRequests] = useState<PeerEndorsementRequest[]>(() =>
    loadStoredPeerRequests()
  );

  // New modules persistent state
  const [applications, setApplications] = useState<ApplicationItem[]>(() => loadStoredApplications());
  const [records, setRecords] = useState<PerformanceRecord[]>(() => loadStoredPerformanceRecords());
  const [learningTasks, setLearningTasks] = useState<LearningTask[]>(() => loadStoredLearningPlan());
  const [skillScores, setSkillScores] = useState<SkillScoreItem[]>(() => loadStoredSkillScores());
  const [xp, setXp] = useState<number>(() => loadStoredXP());

  // Modals & Drawers
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isCreateOppOpen, setIsCreateOppOpen] = useState(false);
  const [isLogAchievementOpen, setIsLogAchievementOpen] = useState(false);
  const [isRequestEndorsementOpen, setIsRequestEndorsementOpen] = useState(false);
  const [endorsementInitialSkill, setEndorsementInitialSkill] = useState<string | undefined>(
    undefined
  );
  const [isSkillVerificationOpen, setIsSkillVerificationOpen] = useState(false);

  // New Modals & Navigation Flow
  const [inspectOpp, setInspectOpp] = useState<Opportunity | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isResumeAnalyzerOpen, setIsResumeAnalyzerOpen] = useState(false);
  const [showAuthView, setShowAuthView] = useState(false);
  const [skillGapTargetOppId, setSkillGapTargetOppId] = useState<string | null>(null);

  // Sync role to localStorage
  useEffect(() => {
    saveStoredRole(currentRole);
  }, [currentRole]);

  // Auth Handlers
  const handleLoginSuccess = (role: UserRole, user: StudentProfile | OrganizerProfile) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    saveStoredRole(role);

    if (role === "student") {
      const student = user as StudentProfile;
      const strength = calculateProfileStrength(student);
      const readiness = calculateCareerReadiness(student, growth);
      const enrichedStudent: StudentProfile = {
        ...student,
        profileStrength: strength,
        careerReadiness: readiness.careerReadiness,
        readinessBreakdown: readiness.readinessBreakdown,
      };

      setStudentUser(enrichedStudent);
      saveStoredStudent(enrichedStudent);

      // Recalculate matches for new student
      const updatedOpps = recalculateAllOpportunities(opportunities, enrichedStudent);
      setOpportunities(updatedOpps);
      saveStoredOpportunities(updatedOpps);

      setCurrentTab("home");
    } else {
      const org = user as OrganizerProfile;
      setOrganizerUser(org);
      saveStoredOrganizer(org);
      setCurrentTab("organizer_home");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveStoredAuthState(false);
    saveActiveUser(null);
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    saveStoredRole(role);
    if (role === "student") {
      setCurrentTab("home");
    } else {
      setCurrentTab("organizer_home");
    }
  };

  // Real Profile Editor Save Handler
  const handleSaveStudentProfile = (updatedProfile: StudentProfile) => {
    const strength = calculateProfileStrength(updatedProfile);
    const readiness = calculateCareerReadiness(updatedProfile, growth);

    const finalProfile: StudentProfile = {
      ...updatedProfile,
      profileStrength: strength,
      careerReadiness: readiness.careerReadiness,
      readinessBreakdown: readiness.readinessBreakdown,
    };

    setStudentUser(finalProfile);
    saveStoredStudent(finalProfile);

    // Recalculate all opportunity matches in real time!
    const updatedOpps = recalculateAllOpportunities(opportunities, finalProfile);
    setOpportunities(updatedOpps);
    saveStoredOpportunities(updatedOpps);

    // Notify user
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Real Profile Synchronized! ✨",
      body: `Profile strength recalculated to ${strength}%. All opportunity match scores refreshed dynamically.`,
      timestamp: "Just now",
      unread: true,
      category: "system",
      linkTab: "home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Instant Add Skill Handler (e.g. from Skill Gap card)
  const handleAddSkillToProfile = (newSkill: string) => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (studentUser.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;

    const updatedSkills = [...studentUser.skills, trimmed];
    const updatedProfile: StudentProfile = {
      ...studentUser,
      skills: updatedSkills,
    };

    handleSaveStudentProfile(updatedProfile);
  };

  // Application to Opportunity
  const handleApplyOpportunity = (id: string) => {
    const updatedOpps = opportunities.map((opp) =>
      opp.id === id ? { ...opp, applied: true } : opp
    );
    setOpportunities(updatedOpps);
    saveStoredOpportunities(updatedOpps);

    const updatedGrowth: GrowthMetrics = {
      ...growth,
      applications: growth.applications + 1,
    };
    setGrowth(updatedGrowth);
    saveStoredGrowth(updatedGrowth);

    const appliedOpp = opportunities.find((o) => o.id === id);
    if (appliedOpp) {
      // Sync into Applications Tracker
      const existing = applications.find((a) => a.opportunityId === id);
      if (!existing) {
        const newApp: ApplicationItem = {
          id: `app-${Date.now()}`,
          opportunityId: appliedOpp.id,
          title: appliedOpp.title,
          organization: appliedOpp.hostOrg,
          type: appliedOpp.type,
          dateApplied: new Date().toISOString().split("T")[0],
          status: "Applied",
          matchScore: appliedOpp.matchPercentage,
          deadline: appliedOpp.deadline || "Open",
          location: appliedOpp.location || "Remote",
          notes: "Applied via SkillMatch AI instant matching engine.",
          mode: appliedOpp.mode === "Remote" ? "Remote" : appliedOpp.mode === "In-Person" ? "In-Person" : "Hybrid",
          appliedVia: "SkillMatch AI",
        };
        const updatedApps = [newApp, ...applications];
        setApplications(updatedApps);
        saveStoredApplications(updatedApps);
      }

      // Award +25 XP
      const newXp = xp + 25;
      setXp(newXp);
      saveStoredXP(newXp);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Application Sent: ${appliedOpp.title}`,
        body: `Your profile has been forwarded to ${appliedOpp.hostOrg}. Status tracked in Applications Tracker. (+25 XP)`,
        timestamp: "Just now",
        unread: true,
        category: "application",
        linkTab: "applications",
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Applications Tracker Handlers
  const handleUpdateAppStatus = (id: string, newStatus: ApplicationStatus) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setApplications(updated);
    saveStoredApplications(updated);

    const targetApp = applications.find((a) => a.id === id);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Status Updated: ${targetApp?.title || "Application"}`,
      body: `Application status moved to "${newStatus}".`,
      timestamp: "Just now",
      unread: true,
      category: "application",
      linkTab: "applications",
    };
    setNotifications([newNotif, ...notifications]);
    saveStoredNotifications([newNotif, ...notifications]);
  };

  const handleUpdateAppNotes = (id: string, notes: string) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, notes } : a
    );
    setApplications(updated);
    saveStoredApplications(updated);
  };

  const handleAddApplication = (newApp: Omit<ApplicationItem, "id">) => {
    const item: ApplicationItem = {
      ...newApp,
      id: `app-${Date.now()}`,
    };
    const updated = [item, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    saveStoredApplications(updated);
  };

  // Learning Plan Handlers
  const handleToggleTask = (taskId: string) => {
    const target = learningTasks.find((t) => t.id === taskId);
    const wasCompleted = target?.completed;
    const updated = learningTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setLearningTasks(updated);
    saveStoredLearningPlan(updated);

    if (!wasCompleted) {
      const earnedXp = xp + 50;
      setXp(earnedXp);
      saveStoredXP(earnedXp);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: "Learning Task Completed! 🎯",
        body: `Finished: "${target?.title}". Earned +50 XP!`,
        timestamp: "Just now",
        unread: true,
        category: "system",
        linkTab: "learning_plan",
      };
      setNotifications([newNotif, ...notifications]);
      saveStoredNotifications([newNotif, ...notifications]);
    }
  };

  const handleAddTask = (newTask: Omit<LearningTask, "id" | "completed">) => {
    const task: LearningTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    const updated = [...learningTasks, task];
    setLearningTasks(updated);
    saveStoredLearningPlan(updated);
  };

  // Performance Record Handlers
  const handleAddPerformanceRecord = (newRecord: Omit<PerformanceRecord, "id">) => {
    const record: PerformanceRecord = {
      ...newRecord,
      id: `rec-${Date.now()}`,
    };
    const updated = [record, ...records];
    setRecords(updated);
    saveStoredPerformanceRecords(updated);

    const earnedXp = xp + 100;
    setXp(earnedXp);
    saveStoredXP(earnedXp);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Verified Milestone Logged: ${record.activity} 🏆`,
      body: `Rank: ${record.rank} • +100 XP added to your career profile.`,
      timestamp: "Just now",
      unread: true,
      category: "system",
      linkTab: "performance",
    };
    setNotifications([newNotif, ...notifications]);
    saveStoredNotifications([newNotif, ...notifications]);
  };

  // Skill Score Add Handler
  const handleAddSkillScore = (
    skillName: string,
    category: SkillCategory,
    proficiency: "Beginner" | "Intermediate" | "Advanced"
  ) => {
    const existing = skillScores.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    let updatedScores = [...skillScores];
    const scoreVal = proficiency === "Advanced" ? 92 : proficiency === "Intermediate" ? 78 : 62;
    if (existing) {
      updatedScores = skillScores.map((s) =>
        s.skill.toLowerCase() === skillName.toLowerCase()
          ? { ...s, score: scoreVal, level: proficiency }
          : s
      );
    } else {
      updatedScores.push({
        skill: skillName,
        category,
        score: scoreVal,
        level: proficiency,
        verified: true,
        endorsements: 1,
        benchmark: 85,
      });
    }
    setSkillScores(updatedScores);
    saveStoredSkillScores(updatedScores);

    // Also ensure skill is in studentUser skills array
    if (!studentUser.skills.includes(skillName)) {
      handleAddSkillToProfile(skillName);
    }
  };

  // Onboarding Complete Handler
  const handleCompleteOnboarding = (
    updatedProfile: Partial<StudentProfile>,
    newSkills: SkillScoreItem[]
  ) => {
    const merged: StudentProfile = {
      ...studentUser,
      ...updatedProfile,
    };
    const strength = calculateProfileStrength(merged);
    const readiness = calculateCareerReadiness(merged, growth);
    const enriched: StudentProfile = {
      ...merged,
      profileStrength: strength,
      careerReadiness: readiness.careerReadiness,
      readinessBreakdown: readiness.readinessBreakdown,
    };
    setStudentUser(enriched);
    saveStoredStudent(enriched);

    if (newSkills && newSkills.length > 0) {
      setSkillScores(newSkills);
      saveStoredSkillScores(newSkills);
    }

    const updatedOpps = recalculateAllOpportunities(opportunities, enriched);
    setOpportunities(updatedOpps);
    saveStoredOpportunities(updatedOpps);

    const bonusXp = xp + 150;
    setXp(bonusXp);
    saveStoredXP(bonusXp);

    setIsAuthenticated(true);
    saveStoredAuthState(true);
    saveActiveUser({
      id: enriched.id || "acc-student",
      email: enriched.email,
      fullName: enriched.name,
      role: "student",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      studentProfile: enriched,
    });
    setIsOnboardingOpen(false);
    setCurrentTab("home");
  };

  // Resume Analyzer Skills Extraction Handler
  const handleApplyExtractedSkills = (extractedSkills: string[]) => {
    let updatedSkillList = [...studentUser.skills];
    extractedSkills.forEach((s) => {
      if (!updatedSkillList.some((item) => item.toLowerCase() === s.toLowerCase())) {
        updatedSkillList.push(s);
      }
    });
    const updatedUser: StudentProfile = {
      ...studentUser,
      skills: updatedSkillList,
    };
    handleSaveStudentProfile(updatedUser);

    const newXp = xp + 75;
    setXp(newXp);
    saveStoredXP(newXp);

    setIsResumeAnalyzerOpen(false);
  };

  // Delete Account Handler
  const handleDeleteAccount = () => {
    resetAllStorage();
    setIsAuthenticated(false);
    saveStoredAuthState(false);
    saveActiveUser(null);
    window.location.reload();
  };

  // Boost Profile Strength / GitHub links
  const handleUpdateProfileStrength = (newScore: number, github: string) => {
    const updated: StudentProfile = {
      ...studentUser,
      profileStrength: newScore,
      githubUrl: github,
      readinessBreakdown: {
        ...studentUser.readinessBreakdown,
        profileCompleteness: 98,
        projects: Math.min(100, studentUser.readinessBreakdown.projects + 12),
      },
      careerReadiness: Math.min(100, studentUser.careerReadiness + 6),
    };
    setStudentUser(updated);
    saveStoredStudent(updated);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Profile Strength Boosted! 🚀",
      body: `GitHub connected. Career readiness increased to ${updated.careerReadiness}%.`,
      timestamp: "Just now",
      unread: true,
      category: "system",
      linkTab: "home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Invite Teammate
  const handleInviteTeammate = (candidateId: string) => {
    const updatedTeammates = teammates.map((t) =>
      t.id === candidateId ? { ...t, invited: true } : t
    );
    setTeammates(updatedTeammates);
    saveStoredTeammates(updatedTeammates);

    const candidate = teammates.find((t) => t.id === candidateId);
    if (candidate) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Teammate Invitation Sent to ${candidate.name}`,
        body: `Invitation sent with ${candidate.compatibility}% compatibility. They will be notified via campus portal.`,
        timestamp: "Just now",
        unread: true,
        category: "team",
        linkTab: "teammatch",
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Add Real Opportunity
  const handleAddOpportunity = (newOpp: Opportunity) => {
    const updatedOpps = [newOpp, ...opportunities];
    // Re-score against student user
    const rescored = recalculateAllOpportunities(updatedOpps, studentUser);
    setOpportunities(rescored);
    saveStoredOpportunities(rescored);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Event Broadcasted: ${newOpp.title}`,
      body: `Opportunity published live. Candidates with matching skill profiles are being notified.`,
      timestamp: "Just now",
      unread: true,
      category: "match",
      linkTab: currentRole === "student" ? "opportunities" : "organizer_home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Add Real Peer in TeamMatch
  const handleAddTeammate = (newPeer: TeammateCandidate) => {
    const updatedTeammates = [newPeer, ...teammates];
    setTeammates(updatedTeammates);
    saveStoredTeammates(updatedTeammates);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Peer Added: ${newPeer.name}`,
      body: `Calculated ${newPeer.compatibility}% skill synergy with your profile.`,
      timestamp: "Just now",
      unread: true,
      category: "team",
      linkTab: "teammatch",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Log Milestone / Hackathon Achievement
  const handleLogMilestone = (event: {
    title: string;
    type: string;
    outcome: string;
    skillsUsed: string[];
    date: string;
  }) => {
    const newEventItem = {
      id: `event-${Date.now()}`,
      ...event,
    };

    const updatedGrowth: GrowthMetrics = {
      ...growth,
      participations: growth.participations + 1,
      completed: growth.completed + 1,
      eventsParticipated: [newEventItem, ...(growth.eventsParticipated || [])],
    };

    // Recalculate student readiness
    const readiness = calculateCareerReadiness(studentUser, updatedGrowth);
    const updatedStudent: StudentProfile = {
      ...studentUser,
      careerReadiness: readiness.careerReadiness,
      readinessBreakdown: readiness.readinessBreakdown,
    };

    // Update badges if criteria met
    const updatedBadges = badges.map((b) => {
      if (b.id === "badge-1") {
        return {
          ...b,
          progress: Math.min(b.maxProgress, b.progress + 1),
          unlocked: true,
          unlockedDate: "Earned today",
        };
      }
      return b;
    });

    setGrowth(updatedGrowth);
    saveStoredGrowth(updatedGrowth);
    setStudentUser(updatedStudent);
    saveStoredStudent(updatedStudent);
    setBadges(updatedBadges);
    saveStoredBadges(updatedBadges);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Milestone Logged: ${event.title} 🏆`,
      body: `Verified ${event.outcome}. Career readiness increased to ${readiness.careerReadiness}%.`,
      timestamp: "Just now",
      unread: true,
      category: "system",
      linkTab: "growth",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Skill Verification & Endorsement Handlers
  const handleOpenRequestEndorsement = (skill?: string) => {
    setEndorsementInitialSkill(skill);
    setIsRequestEndorsementOpen(true);
  };

  const handleOpenVerificationHub = () => {
    setIsSkillVerificationOpen(true);
  };

  const handleEndorsementRequestSubmitted = (
    newEndorsement: SkillEndorsement,
    autoApprove?: boolean
  ) => {
    const existing = studentUser.endorsements || [];
    const updatedEndorsements = [newEndorsement, ...existing];

    const updatedStudent: StudentProfile = {
      ...studentUser,
      endorsements: updatedEndorsements,
    };

    const strength = calculateProfileStrength(updatedStudent);
    const readiness = calculateCareerReadiness(updatedStudent, growth);
    updatedStudent.profileStrength = strength;
    updatedStudent.careerReadiness = readiness.careerReadiness;
    updatedStudent.readinessBreakdown = readiness.readinessBreakdown;

    setStudentUser(updatedStudent);
    saveStoredStudent(updatedStudent);
    saveStoredEndorsements(updatedEndorsements);

    // Recalculate opportunities with newly verified skill boost
    const updatedOpps = recalculateAllOpportunities(opportunities, updatedStudent);
    setOpportunities(updatedOpps);
    saveStoredOpportunities(updatedOpps);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: autoApprove
        ? `Skill Verified: ${newEndorsement.skill} ✓`
        : `Endorsement Requested: ${newEndorsement.skill}`,
      body: autoApprove
        ? `Verified by teammate ${newEndorsement.endorserName} for ${newEndorsement.projectOrEvent}. Verified badge added to profile!`
        : `Request sent to ${newEndorsement.endorserName}. You will receive a verified badge once approved.`,
      timestamp: "Just now",
      unread: true,
      category: "match",
      linkTab: "home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  const handleApprovePendingEndorsement = (endorsementId: string) => {
    const updatedEndorsements = (studentUser.endorsements || []).map((e) => {
      if (e.id === endorsementId) {
        return {
          ...e,
          status: "verified" as const,
          verifiedAt: "Just now",
          proficiencyRating: 5,
        };
      }
      return e;
    });

    const target = updatedEndorsements.find((e) => e.id === endorsementId);

    const updatedStudent: StudentProfile = {
      ...studentUser,
      endorsements: updatedEndorsements,
    };

    const strength = calculateProfileStrength(updatedStudent);
    const readiness = calculateCareerReadiness(updatedStudent, growth);
    updatedStudent.profileStrength = strength;
    updatedStudent.careerReadiness = readiness.careerReadiness;
    updatedStudent.readinessBreakdown = readiness.readinessBreakdown;

    setStudentUser(updatedStudent);
    saveStoredStudent(updatedStudent);
    saveStoredEndorsements(updatedEndorsements);

    const updatedOpps = recalculateAllOpportunities(opportunities, updatedStudent);
    setOpportunities(updatedOpps);
    saveStoredOpportunities(updatedOpps);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Skill Verified: ${target?.skill || "Skill"} ✓`,
      body: `Teammate endorsement confirmed by ${target?.endorserName || "collaborator"}. Verified badge active!`,
      timestamp: "Just now",
      unread: true,
      category: "match",
      linkTab: "home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  const handleSubmitPeerEndorsement = (
    requestId: string,
    comment: string,
    rating: number
  ) => {
    const updatedRequests = peerRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "endorsed" as const,
          givenComment: comment,
          givenRating: rating,
        };
      }
      return r;
    });

    const target = updatedRequests.find((r) => r.id === requestId);

    setPeerRequests(updatedRequests);
    saveStoredPeerRequests(updatedRequests);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Endorsement Confirmed for ${target?.requesterName || "Teammate"}`,
      body: `You vouched for their ${target?.skill} expertise on ${target?.projectOrEvent}. Teammate trust score +15!`,
      timestamp: "Just now",
      unread: true,
      category: "team",
      linkTab: "home",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Reset to initial clean state
  const handleResetDemoData = () => {
    if (window.confirm("Reset all state and stored data back to clean defaults?")) {
      resetAllStorage();
      window.location.reload();
    }
  };

  // If not authenticated, render interactive Landing Page or Auth View
  if (!isAuthenticated) {
    if (showAuthView) {
      return (
        <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans">
          <div className="max-w-md mx-auto pt-6 px-4">
            <button
              onClick={() => setShowAuthView(false)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 mb-2 py-1 px-2.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              ← Return to SkillMatch AI Home
            </button>
          </div>
          <AuthView
            onLoginSuccess={handleLoginSuccess}
            defaultStudent={studentUser}
            defaultOrganizer={organizerUser}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        <LandingPage
          onGetStarted={() => setIsOnboardingOpen(true)}
          onExploreOpportunities={() => {
            handleLoginSuccess("student", studentUser);
            setCurrentTab("opportunities");
          }}
          onLoginDemoAccount={() => handleLoginSuccess("student", studentUser)}
          onOpenLogin={() => setShowAuthView(true)}
        />

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onCompleteOnboarding={handleCompleteOnboarding}
          initialProfile={studentUser}
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
        userEmail={currentRole === "student" ? studentUser.email : organizerUser.contact}
        emailVerified={
          currentRole === "student"
            ? studentUser.emailVerified !== false
            : organizerUser.emailVerified !== false
        }
        onLogout={handleLogout}
        onOpenProfileEditor={() => setIsProfileEditorOpen(true)}
        onOpenCreateOpp={() => setIsCreateOppOpen(true)}
        onResetData={handleResetDemoData}
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
                onInspectOpportunity={(opp) => setInspectOpp(opp)}
                onOpenProfileEditor={() => setIsProfileEditorOpen(true)}
                onAddSkillToProfile={handleAddSkillToProfile}
                onOpenCreateOpp={() => setIsCreateOppOpen(true)}
                onOpenVerificationHub={handleOpenVerificationHub}
                onOpenRequestEndorsement={handleOpenRequestEndorsement}
              />
            )}

            {currentTab === "opportunities" && (
              <OpportunitiesView
                opportunities={opportunities}
                profile={studentUser}
                onApplyOpportunity={handleApplyOpportunity}
                onInspectOpportunity={(opp) => setInspectOpp(opp)}
                onNavigateTeamMatch={() => setCurrentTab("teammatch")}
                onOpenCreateOpp={() => setIsCreateOppOpen(true)}
              />
            )}

            {currentTab === "skill_profile" && (
              <AISkillProfileView
                profile={studentUser}
                skillScores={skillScores}
                onAddSkill={handleAddSkillScore}
                onRequestEndorsement={handleOpenRequestEndorsement}
                onOpenResumeAnalyzer={() => setIsResumeAnalyzerOpen(true)}
                onNavigateToSkillGap={() => setCurrentTab("skill_gap")}
              />
            )}

            {currentTab === "skill_gap" && (
              <SkillGapAnalyzerView
                opportunities={opportunities}
                profile={studentUser}
                skillScores={skillScores}
                selectedOppId={skillGapTargetOppId}
                onNavigateToLearningPlan={() => setCurrentTab("learning_plan")}
                onAddSkill={handleAddSkillToProfile}
                onSelectOpp={(id) => setSkillGapTargetOppId(id)}
              />
            )}

            {currentTab === "learning_plan" && (
              <LearningPlanView
                learningTasks={learningTasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                profile={studentUser}
              />
            )}

            {currentTab === "applications" && (
              <ApplicationsTrackerView
                applications={applications}
                onUpdateStatus={handleUpdateAppStatus}
                onUpdateNotes={handleUpdateAppNotes}
                onAddApplication={handleAddApplication}
                onDeleteApplication={handleDeleteApplication}
                onNavigateToOpportunities={() => setCurrentTab("opportunities")}
              />
            )}

            {currentTab === "performance" && (
              <PerformanceHistoryView
                records={records}
                onAddRecord={handleAddPerformanceRecord}
              />
            )}

            {currentTab === "achievements" && (
              <AchievementsView
                badges={badges}
                xp={xp}
                onClaimBadge={(badgeId) => {
                  const targetBadge = badges.find((b) => b.id === badgeId);
                  if (targetBadge && !targetBadge.unlocked) {
                    const updatedBadges = badges.map((b) =>
                      b.id === badgeId ? { ...b, unlocked: true } : b
                    );
                    setBadges(updatedBadges);
                    saveStoredBadges(updatedBadges);
                    const bonus = xp + 75;
                    setXp(bonus);
                    saveStoredXP(bonus);
                  }
                }}
              />
            )}

            {currentTab === "teammatch" && (
              <TeamMatchView
                profile={studentUser}
                opportunities={opportunities}
                teammates={teammates}
                onInviteTeammate={handleInviteTeammate}
                onAddTeammate={handleAddTeammate}
              />
            )}

            {currentTab === "growth" && (
              <GrowthDashboardView
                profile={studentUser}
                badges={badges}
                growth={growth}
                onNavigateTab={setCurrentTab}
                onOpenLogAchievement={() => setIsLogAchievementOpen(true)}
                onOpenVerificationHub={handleOpenVerificationHub}
                onOpenRequestEndorsement={handleOpenRequestEndorsement}
              />
            )}

            {currentTab === "assistant" && (
              <AICareerAssistantView profile={studentUser} />
            )}

            {currentTab === "settings" && (
              <SettingsView
                profile={studentUser}
                onUpdateProfile={handleSaveStudentProfile}
                onResetAllData={handleResetDemoData}
                onDeleteAccount={handleDeleteAccount}
              />
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

      {/* Explainable Match Breakdown Modal */}
      <ExplainableMatchModal
        isOpen={inspectOpp !== null}
        onClose={() => setInspectOpp(null)}
        opportunity={inspectOpp}
        profile={studentUser}
        onApply={(oppId) => {
          handleApplyOpportunity(oppId);
          setInspectOpp(null);
        }}
        onNavigateToSkillGap={(oppId) => {
          setSkillGapTargetOppId(oppId);
          setInspectOpp(null);
          setCurrentTab("skill_gap");
        }}
        onNavigateToLearningPlan={() => {
          setInspectOpp(null);
          setCurrentTab("learning_plan");
        }}
        onNavigateToTeamMatch={() => {
          setInspectOpp(null);
          setCurrentTab("teammatch");
        }}
        isApplied={inspectOpp?.applied}
      />

      {/* AI Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={isResumeAnalyzerOpen}
        onClose={() => setIsResumeAnalyzerOpen(false)}
        onApplyExtractedSkills={handleApplyExtractedSkills}
        currentResumeName="Rahul_Sharma_AI_Resume.pdf"
      />

      {/* 5-Step Interactive Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
        initialProfile={studentUser}
      />

      {/* Profile Editor Modal */}
      <ProfileEditorModal
        isOpen={isProfileEditorOpen}
        onClose={() => setIsProfileEditorOpen(false)}
        currentProfile={studentUser}
        onSaveProfile={handleSaveStudentProfile}
      />

      {/* Create Opportunity Modal */}
      <CreateOpportunityModal
        isOpen={isCreateOppOpen}
        onClose={() => setIsCreateOppOpen(false)}
        onAddOpportunity={handleAddOpportunity}
        currentStudentProfile={studentUser}
        defaultHostOrg={currentRole === "organizer" ? organizerUser.orgName : "Campus Innovation Lab"}
      />

      {/* Log Milestone Modal */}
      <LogAchievementModal
        isOpen={isLogAchievementOpen}
        onClose={() => setIsLogAchievementOpen(false)}
        onLogEvent={handleLogMilestone}
      />

      {/* Ecosystem Interactive Modal */}
      <EcosystemModal
        isOpen={isEcosystemOpen}
        onClose={() => setIsEcosystemOpen(false)}
        onNavigateTab={setCurrentTab}
      />

      {/* Request Endorsement Modal */}
      <RequestEndorsementModal
        isOpen={isRequestEndorsementOpen}
        onClose={() => {
          setIsRequestEndorsementOpen(false);
          setEndorsementInitialSkill(undefined);
        }}
        profile={studentUser}
        initialSkill={endorsementInitialSkill}
        onRequestSubmitted={handleEndorsementRequestSubmitted}
      />

      {/* Skill Verification & Endorsements Hub Modal */}
      <SkillVerificationModal
        isOpen={isSkillVerificationOpen}
        onClose={() => setIsSkillVerificationOpen(false)}
        profile={studentUser}
        peerRequests={peerRequests}
        onOpenRequestModal={(skill) => {
          setIsSkillVerificationOpen(false);
          handleOpenRequestEndorsement(skill);
        }}
        onApprovePendingEndorsement={handleApprovePendingEndorsement}
        onSubmitPeerEndorsement={handleSubmitPeerEndorsement}
        onAddSkill={handleAddSkillToProfile}
      />
    </div>
  );
}
