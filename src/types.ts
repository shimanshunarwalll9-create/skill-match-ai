export type UserRole = "student" | "organizer";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: "student";
  course: string;
  year: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  preferredOpportunities: string[];
  resumeName?: string;
  resumeUploaded: boolean;
  profileStrength: number; // e.g. 82
  careerReadiness: number; // e.g. 76
  readinessBreakdown: {
    skills: number; // 82
    projects: number; // 71
    experience: number; // 65
    participation: number; // 80
    profileCompleteness: number; // 90
  };
  aiRecommendation: string;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  college?: string;
  bio?: string;
  projects?: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repoUrl?: string;
  }[];
  endorsements?: SkillEndorsement[];
  emailVerified?: boolean;
  emailVerifiedAt?: string;
}

export interface SkillEndorsement {
  id: string;
  skill: string;
  endorserName: string;
  endorserRole: string;
  endorserAvatar?: string;
  projectOrEvent: string;
  relationship: "teammate" | "collaborator" | "lead" | "peer";
  comment?: string;
  status: "verified" | "pending";
  requestedAt: string;
  verifiedAt?: string;
  proficiencyRating?: number; // 1 to 5
}

export interface PeerEndorsementRequest {
  id: string;
  requesterName: string;
  requesterRole: string;
  requesterAvatar?: string;
  skill: string;
  projectOrEvent: string;
  requestedAt: string;
  note?: string;
  status: "pending" | "endorsed" | "declined";
  givenComment?: string;
  givenRating?: number;
}

export interface OrganizerProfile {
  id: string;
  name: string;
  email: string;
  role: "organizer";
  orgName: string;
  orgType: "University" | "Tech Company" | "Community" | "Incubator" | "Other";
  website: string;
  contact: string;
  description: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  studentProfile?: StudentProfile;
  organizerProfile?: OrganizerProfile;
}

export interface VerificationDispatch {
  email: string;
  code: string;
  expiresAt: number;
  subject: string;
  htmlBody: string;
  sentVia: "smtp" | "simulated_preview";
}

export interface Opportunity {
  id: string;
  title: string;
  type: "Hackathon" | "Internship" | "Workshop" | "Competition" | "Scholarship";
  hostOrg: string;
  matchPercentage: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  eligibility: string;
  deadline: string;
  location: string;
  mode: "Remote" | "In-Person" | "Hybrid";
  description: string;
  tag?: string;
  perks?: string[];
  applied?: boolean;
  createdByUser?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  category: "hackathon" | "applications" | "projects" | "learning" | "streak";
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: string;
}

export interface TeammateCandidate {
  id: string;
  name: string;
  college: string;
  year: string;
  roleTitle: string;
  skills: string[];
  complementarySkills: string[];
  compatibility: number; // e.g. 91
  avatarUrl?: string;
  matchReason: string;
  invited?: boolean;
  bio?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
  category: "match" | "application" | "team" | "system";
  linkTab?: string;
}

export interface GrowthMetrics {
  participations: number; // 8
  applications: number; // 15
  completed: number; // 4
  selected: number; // 2
  streakDays: number; // 7
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  quickPromptsUsed?: string;
}
