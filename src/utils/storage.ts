import {
  StudentProfile,
  OrganizerProfile,
  Opportunity,
  TeammateCandidate,
  GrowthMetrics,
  NotificationItem,
  AchievementBadge,
  UserRole,
  SkillEndorsement,
  PeerEndorsementRequest,
  RegisteredUser,
} from "../types";
import {
  initialStudentProfile,
  initialOrganizerProfile,
  mockOpportunities,
  mockTeammates,
  growthMetrics,
  initialNotifications,
  mockBadges,
  initialPeerEndorsementRequests,
  initialSkillScores,
  initialApplications,
  initialPerformanceRecords,
  initialLearningPlan,
} from "../data/mockData";
import {
  SkillScoreItem,
  ApplicationItem,
  PerformanceRecord,
  LearningTask,
} from "../types";

const KEYS = {
  STUDENT: "skillmatch_student_profile_v2",
  ORGANIZER: "skillmatch_organizer_profile_v2",
  OPPORTUNITIES: "skillmatch_opportunities_v2",
  TEAMMATES: "skillmatch_teammates_v2",
  GROWTH: "skillmatch_growth_v2",
  NOTIFICATIONS: "skillmatch_notifications_v2",
  BADGES: "skillmatch_badges_v2",
  ROLE: "skillmatch_current_role_v2",
  AUTH: "skillmatch_is_auth_v2",
  ENDORSEMENTS: "skillmatch_endorsements_v2",
  PEER_REQUESTS: "skillmatch_peer_requests_v2",
  ACCOUNTS: "skillmatch_accounts_v2",
  ACTIVE_USER: "skillmatch_active_user_v2",
  APPLICATIONS: "skillmatch_applications_v2",
  PERFORMANCE: "skillmatch_performance_v2",
  LEARNING_PLAN: "skillmatch_learning_plan_v2",
  SKILL_SCORES: "skillmatch_skill_scores_v2",
};

export function loadStoredStudent(): StudentProfile {
  try {
    const raw = localStorage.getItem(KEYS.STUDENT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load student profile from storage:", e);
  }
  return initialStudentProfile;
}

export function saveStoredStudent(profile: StudentProfile) {
  try {
    localStorage.setItem(KEYS.STUDENT, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save student profile to storage:", e);
  }
}

export function loadStoredOrganizer(): OrganizerProfile {
  try {
    const raw = localStorage.getItem(KEYS.ORGANIZER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load organizer profile from storage:", e);
  }
  return initialOrganizerProfile;
}

export function saveStoredOrganizer(profile: OrganizerProfile) {
  try {
    localStorage.setItem(KEYS.ORGANIZER, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save organizer profile to storage:", e);
  }
}

export function loadStoredOpportunities(): Opportunity[] {
  try {
    const raw = localStorage.getItem(KEYS.OPPORTUNITIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load opportunities from storage:", e);
  }
  return mockOpportunities;
}

export function saveStoredOpportunities(opps: Opportunity[]) {
  try {
    localStorage.setItem(KEYS.OPPORTUNITIES, JSON.stringify(opps));
  } catch (e) {
    console.error("Failed to save opportunities to storage:", e);
  }
}

export function loadStoredTeammates(): TeammateCandidate[] {
  try {
    const raw = localStorage.getItem(KEYS.TEAMMATES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load teammates from storage:", e);
  }
  return mockTeammates;
}

export function saveStoredTeammates(teammates: TeammateCandidate[]) {
  try {
    localStorage.setItem(KEYS.TEAMMATES, JSON.stringify(teammates));
  } catch (e) {
    console.error("Failed to save teammates to storage:", e);
  }
}

export function loadStoredGrowth(): GrowthMetrics {
  try {
    const raw = localStorage.getItem(KEYS.GROWTH);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load growth metrics from storage:", e);
  }
  return growthMetrics;
}

export function saveStoredGrowth(growth: GrowthMetrics) {
  try {
    localStorage.setItem(KEYS.GROWTH, JSON.stringify(growth));
  } catch (e) {
    console.error("Failed to save growth metrics to storage:", e);
  }
}

export function loadStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load notifications from storage:", e);
  }
  return initialNotifications;
}

export function saveStoredNotifications(notifications: NotificationItem[]) {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error("Failed to save notifications to storage:", e);
  }
}

export function loadStoredBadges(): AchievementBadge[] {
  try {
    const raw = localStorage.getItem(KEYS.BADGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load badges from storage:", e);
  }
  return mockBadges;
}

export function saveStoredBadges(badges: AchievementBadge[]) {
  try {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error("Failed to save badges to storage:", e);
  }
}

export function loadStoredRole(): UserRole {
  try {
    const raw = localStorage.getItem(KEYS.ROLE);
    if (raw === "student" || raw === "organizer") return raw;
  } catch (e) {
    console.error("Failed to load role:", e);
  }
  return "student";
}

export function saveStoredRole(role: UserRole) {
  try {
    localStorage.setItem(KEYS.ROLE, role);
  } catch (e) {
    console.error("Failed to save role:", e);
  }
}

export function loadStoredEndorsements(): SkillEndorsement[] {
  try {
    const raw = localStorage.getItem(KEYS.ENDORSEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load endorsements from storage:", e);
  }
  return initialStudentProfile.endorsements || [];
}

export function saveStoredEndorsements(endorsements: SkillEndorsement[]) {
  try {
    localStorage.setItem(KEYS.ENDORSEMENTS, JSON.stringify(endorsements));
  } catch (e) {
    console.error("Failed to save endorsements to storage:", e);
  }
}

export function loadStoredPeerRequests(): PeerEndorsementRequest[] {
  try {
    const raw = localStorage.getItem(KEYS.PEER_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load peer requests from storage:", e);
  }
  return initialPeerEndorsementRequests;
}

export function saveStoredPeerRequests(requests: PeerEndorsementRequest[]) {
  try {
    localStorage.setItem(KEYS.PEER_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error("Failed to save peer requests to storage:", e);
  }
}

// ---------------- AUTHENTICATION & SESSIONS ----------------

export function loadStoredAuthState(): boolean {
  try {
    // Check session first, then remember-me local storage
    const sessionAuth = sessionStorage.getItem(KEYS.AUTH);
    if (sessionAuth === "true") return true;
    const localAuth = localStorage.getItem(KEYS.AUTH);
    if (localAuth === "true") return true;
  } catch (e) {
    console.error("Failed to load auth state:", e);
  }
  // Default to false so website opens with login and sign up interface
  return false;
}

export function saveStoredAuthState(isAuth: boolean, remember: boolean = true) {
  try {
    if (isAuth) {
      sessionStorage.setItem(KEYS.AUTH, "true");
      if (remember) {
        localStorage.setItem(KEYS.AUTH, "true");
      }
    } else {
      sessionStorage.removeItem(KEYS.AUTH);
      localStorage.removeItem(KEYS.AUTH);
    }
  } catch (e) {
    console.error("Failed to save auth state:", e);
  }
}

export function loadStoredAccounts(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(KEYS.ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load accounts:", e);
  }

  // Seed default demo accounts
  const seedAccounts: RegisteredUser[] = [
    {
      id: "acc-rahul",
      email: "rahul.sharma@campus.edu",
      password: "password123",
      fullName: "Rahul Sharma",
      role: "student",
      emailVerified: true,
      emailVerifiedAt: "2026-01-15T10:00:00.000Z",
      createdAt: "2026-01-10T09:00:00.000Z",
      studentProfile: initialStudentProfile,
    },
    {
      id: "acc-organizer",
      email: "arvind@hacksphere.org",
      password: "password123",
      fullName: "Dr. Arvind Varma",
      role: "organizer",
      emailVerified: true,
      emailVerifiedAt: "2026-01-12T14:30:00.000Z",
      createdAt: "2026-01-05T12:00:00.000Z",
      organizerProfile: initialOrganizerProfile,
    },
  ];

  try {
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(seedAccounts));
  } catch (e) {
    // Ignore storage issues
  }
  return seedAccounts;
}

export function saveStoredAccounts(accounts: RegisteredUser[]) {
  try {
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error("Failed to save accounts:", e);
  }
}

export function findUserByEmail(email: string): RegisteredUser | undefined {
  const accounts = loadStoredAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email.trim().toLowerCase() === normalized);
}

export function registerNewUser(user: RegisteredUser): RegisteredUser {
  const accounts = loadStoredAccounts();
  const normalizedEmail = user.email.trim().toLowerCase();
  const existingIdx = accounts.findIndex((a) => a.email.trim().toLowerCase() === normalizedEmail);

  if (existingIdx >= 0) {
    accounts[existingIdx] = { ...accounts[existingIdx], ...user };
  } else {
    accounts.push(user);
  }

  saveStoredAccounts(accounts);
  return user;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const accounts = loadStoredAccounts();
  const normalized = email.trim().toLowerCase();
  const user = accounts.find((a) => a.email.trim().toLowerCase() === normalized);
  if (!user) return false;
  user.password = newPassword;
  saveStoredAccounts(accounts);
  return true;
}

export function markUserEmailVerified(email: string): RegisteredUser | null {
  const accounts = loadStoredAccounts();
  const normalized = email.trim().toLowerCase();
  const user = accounts.find((a) => a.email.trim().toLowerCase() === normalized);
  if (!user) return null;
  user.emailVerified = true;
  user.emailVerifiedAt = new Date().toISOString();
  saveStoredAccounts(accounts);
  return user;
}

export function loadActiveUser(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_USER) || sessionStorage.getItem(KEYS.ACTIVE_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load active user:", e);
  }
  return null;
}

export function saveActiveUser(user: RegisteredUser | null) {
  try {
    if (user) {
      localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
      sessionStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_USER);
      sessionStorage.removeItem(KEYS.ACTIVE_USER);
    }
  } catch (e) {
    console.error("Failed to save active user:", e);
  }
}

export function resetAllStorageToDefaults() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch (e) {
    console.error("Failed to clear storage:", e);
  }
}

export const resetAllStorage = resetAllStorageToDefaults;
