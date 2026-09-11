import { StudentProfile, Opportunity, TeammateCandidate, GrowthMetrics, SkillEndorsement } from "../types";

// Standardize and normalize tech skill names & aliases
export function normalizeSkill(skill: string): string {
  const s = skill.trim().toLowerCase();
  const aliasMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    "react.js": "react",
    reactjs: "react",
    "node.js": "node.js",
    nodejs: "node.js",
    "vue.js": "vue",
    vuejs: "vue",
    "next.js": "next.js",
    nextjs: "next.js",
    py: "python",
    ml: "machine learning",
    dl: "deep learning",
    ai: "artificial intelligence",
    genai: "generative ai",
    "generative-ai": "generative ai",
    k8s: "kubernetes",
    postgres: "sql",
    postgresql: "sql",
    mysql: "sql",
    cv: "computer vision",
    nlp: "natural language processing",
    aws: "cloud",
    gcp: "cloud",
    azure: "cloud",
  };
  return aliasMap[s] || s;
}

// Determines if a user skill matches a required skill
export function isSkillMatch(userSkill: string, requiredSkill: string): boolean {
  const normUser = normalizeSkill(userSkill);
  const normReq = normalizeSkill(requiredSkill);

  if (normUser === normReq) return true;
  if (normUser.includes(normReq) || normReq.includes(normUser)) return true;

  // Partial multi-word check (e.g. "React Native" matches "React")
  const userTokens = normUser.split(/[\s,/-]+/);
  const reqTokens = normReq.split(/[\s,/-]+/);
  return userTokens.some((ut) => ut.length > 2 && reqTokens.includes(ut));
}

// Calculates dynamic match percentage, matched skills, and missing skills
export function calculateOpportunityMatch(
  userSkills: string[],
  requiredSkills: string[],
  interests: string[] = []
): {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of requiredSkills) {
    const isMatched = userSkills.some((us) => isSkillMatch(us, req));
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  // Calculate base score
  const matchRatio = matchedSkills.length / requiredSkills.length;
  let rawScore = Math.round(matchRatio * 100);

  // Bonus for relevant interests (up to +10%)
  const hasRelevantInterest = interests.some((interest) =>
    missingSkills.some((ms) => isSkillMatch(interest, ms))
  );
  if (hasRelevantInterest && rawScore < 95) {
    rawScore = Math.min(95, rawScore + 6);
  }

  // Clamp: if all matched, ensure high score (95-100%); minimum baseline 15%
  const finalPercentage =
    matchedSkills.length === requiredSkills.length
      ? Math.max(92, Math.min(100, rawScore))
      : Math.max(15, Math.min(94, rawScore));

  return {
    matchPercentage: finalPercentage,
    matchedSkills,
    missingSkills,
  };
}

// Recalculates all opportunities for a student profile
export function recalculateAllOpportunities(
  opportunities: Opportunity[],
  profile: StudentProfile
): Opportunity[] {
  return opportunities.map((opp) => {
    const match = calculateOpportunityMatch(
      profile.skills,
      opp.requiredSkills,
      profile.interests
    );

    return {
      ...opp,
      matchPercentage: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
    };
  });
}

// Helper to extract skill verification and endorsement details
export function getSkillVerification(
  skill: string,
  endorsements: SkillEndorsement[] = []
): {
  isVerified: boolean;
  count: number;
  pendingCount: number;
  endorsements: SkillEndorsement[];
  averageRating: number;
} {
  const verifiedMatches = endorsements.filter(
    (e) => isSkillMatch(e.skill, skill) && e.status === "verified"
  );
  const pendingMatches = endorsements.filter(
    (e) => isSkillMatch(e.skill, skill) && e.status === "pending"
  );

  const ratings = verifiedMatches
    .map((e) => e.proficiencyRating || 5)
    .filter(Boolean);
  const avg =
    ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : 5.0;

  return {
    isVerified: verifiedMatches.length > 0,
    count: verifiedMatches.length,
    pendingCount: pendingMatches.length,
    endorsements: verifiedMatches,
    averageRating: avg,
  };
}

// Calculates dynamic profile strength based on filled fields
export function calculateProfileStrength(profile: StudentProfile): number {
  let score = 0;

  if (profile.name?.trim()) score += 10;
  if (profile.email?.trim()) score += 5;
  if (profile.course?.trim()) score += 5;
  if (profile.year?.trim()) score += 5;

  // Skills (up to 20%)
  const skillCount = profile.skills?.length || 0;
  score += Math.min(20, skillCount * 4);

  // Verified Skill Endorsements bonus (up to 12%)
  const verifiedSkillsCount = (profile.skills || []).filter((s) => {
    const v = getSkillVerification(s, profile.endorsements || []);
    return v.isVerified;
  }).length;
  score += Math.min(12, verifiedSkillsCount * 4);

  // Interests (up to 8%)
  const interestCount = profile.interests?.length || 0;
  score += Math.min(8, interestCount * 2);

  // Career Goal (8%)
  if (profile.careerGoal?.trim()) score += 8;

  // Resume (8%)
  if (profile.resumeUploaded || profile.resumeName) score += 8;

  // Links & Portfolios (14%)
  if (profile.githubUrl?.trim()) score += 7;
  if (profile.portfolioUrl?.trim() || profile.linkedinUrl?.trim()) score += 7;

  // Projects (up to 10%)
  if (profile.projects && profile.projects.length > 0) {
    score += Math.min(10, profile.projects.length * 5);
  }

  return Math.min(100, Math.max(20, score));
}

// Calculates dynamic career readiness breakdown and composite score
export function calculateCareerReadiness(
  profile: StudentProfile,
  growth: GrowthMetrics
): {
  careerReadiness: number;
  readinessBreakdown: StudentProfile["readinessBreakdown"];
} {
  const verifiedCount = (profile.skills || []).filter((s) => {
    return getSkillVerification(s, profile.endorsements || []).isVerified;
  }).length;

  const skillsScore = Math.min(
    100,
    Math.round((profile.skills?.length || 0) * 10 + 20 + verifiedCount * 5)
  );
  const projectsCount = (profile.projects?.length || 1);
  const projectsScore = Math.min(
    100,
    Math.round(projectsCount * 25 + (profile.githubUrl ? 20 : 0))
  );
  const experienceScore = Math.min(
    100,
    Math.round(
      (profile.resumeUploaded ? 40 : 15) +
        (growth.completed || 0) * 12 +
        verifiedCount * 3
    )
  );
  const participationScore = Math.min(
    100,
    Math.round(Math.min(100, (growth.participations || 0) * 10 + (growth.applications || 0) * 4))
  );
  const completenessScore = profile.profileStrength || 75;

  const breakdown = {
    skills: skillsScore,
    projects: projectsScore,
    experience: experienceScore,
    participation: participationScore,
    profileCompleteness: completenessScore,
  };

  const composite = Math.round(
    skillsScore * 0.25 +
      projectsScore * 0.25 +
      experienceScore * 0.2 +
      participationScore * 0.15 +
      completenessScore * 0.15
  );

  return {
    careerReadiness: Math.min(100, Math.max(30, composite)),
    readinessBreakdown: breakdown,
  };
}

// Dynamically calculates complementary skills and compatibility for a teammate
export function calculateTeammateSynergy(
  userSkills: string[],
  candidate: TeammateCandidate,
  targetOpportunity?: Opportunity
): TeammateCandidate {
  // Complementary skills: skills the candidate has that the user does NOT have
  const complementary = candidate.skills.filter(
    (cs) => !userSkills.some((us) => isSkillMatch(us, cs))
  );

  // If a target opportunity is provided, check which missing skills the candidate covers
  let targetedBonus = 0;
  let keyCovers: string[] = [];

  if (targetOpportunity?.missingSkills) {
    keyCovers = targetOpportunity.missingSkills.filter((ms) =>
      candidate.skills.some((cs) => isSkillMatch(cs, ms))
    );
    targetedBonus = keyCovers.length * 10;
  }

  // Compatibility formula
  const baseSynergy = 72;
  const compBonus = complementary.length * 6;
  const compatibility = Math.min(98, Math.max(65, baseSynergy + compBonus + targetedBonus));

  const matchReason =
    keyCovers.length > 0
      ? `Fills your missing ${keyCovers.join(", ")} skills for this event and brings strong ${candidate.skills[0]} expertise.`
      : complementary.length > 0
      ? `Brings complementary ${complementary.slice(0, 3).join(", ")} skills to complement your ${userSkills[0] || "core"} strengths.`
      : `Solid peer with complementary ${candidate.roleTitle} background.`;

  return {
    ...candidate,
    complementarySkills: complementary.length > 0 ? complementary : candidate.complementarySkills,
    compatibility,
    matchReason,
  };
}
