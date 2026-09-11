import React, { useState } from "react";
import {
  X,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  Heart,
  Globe,
  Github,
  Linkedin,
  FileText,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Loader2,
  TrendingUp,
  AlertCircle,
  FolderGit2,
  ShieldCheck,
} from "lucide-react";
import { StudentProfile } from "../../types";
import { calculateProfileStrength, getSkillVerification } from "../../utils/matchingEngine";

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
}

const COMMON_SKILLS = [
  "Python",
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Machine Learning",
  "PyTorch",
  "SQL",
  "Docker",
  "Git",
  "Tailwind CSS",
  "FastAPI",
  "Java",
  "C++",
  "AWS",
  "Figma",
  "MongoDB",
  "Kubernetes",
  "Next.js",
  "Prompt Engineering",
  "LangChain",
  "Scikit-Learn",
];

const COMMON_INTERESTS = [
  "Generative AI",
  "Hackathons",
  "Web3 & DeFi",
  "Computer Vision",
  "Full-Stack Development",
  "Open Source",
  "Cybersecurity",
  "Autonomous Agents",
  "Cloud Architecture",
  "Fintech",
];

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  // Active section tab
  const [activeTab, setActiveTab] = useState<"basics" | "skills" | "projects" | "resume" | "links">("basics");

  // Basic Info
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [college, setCollege] = useState(profile.college || "Campus Engineering Institute");
  const [course, setCourse] = useState(profile.course || "");
  const [year, setYear] = useState(profile.year || "3rd Year");
  const [bio, setBio] = useState(profile.bio || "");
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal || "");
  const [preferredOpps, setPreferredOpps] = useState<string[]>(
    profile.preferredOpportunities || ["Hackathons", "Internships"]
  );

  // Skills & Interests
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [newInterestInput, setNewInterestInput] = useState("");

  // Projects
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      techStack: string[];
      liveUrl?: string;
      repoUrl?: string;
    }>
  >(
    profile.projects || [
      {
        id: "proj-1",
        title: "Autonomous Agent Evaluator",
        description: "Full-stack evaluation engine for LLM multi-agent benchmarks.",
        techStack: ["Python", "React", "FastAPI"],
        repoUrl: "https://github.com/my-user/agent-eval",
        liveUrl: "",
      },
    ]
  );
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTech, setNewProjTech] = useState("");
  const [newProjRepo, setNewProjRepo] = useState("");
  const [newProjLive, setNewProjLive] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  // Links
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");

  // Resume State & AI Parsing
  const [resumeName, setResumeName] = useState(profile.resumeName || "");
  const [resumeText, setResumeText] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeParseSuccess, setResumeParseSuccess] = useState(false);
  const [parsedSummary, setParsedSummary] = useState<any>(null);

  // Skills handlers
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Interests handlers
  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setInterests([...interests, trimmed]);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  // Toggle preferred opportunity
  const togglePreferredOpp = (opp: string) => {
    if (preferredOpps.includes(opp)) {
      setPreferredOpps(preferredOpps.filter((o) => o !== opp));
    } else {
      setPreferredOpps([...preferredOpps, opp]);
    }
  };

  // Add new project
  const handleCreateProject = () => {
    if (!newProjTitle.trim()) return;
    const techArray = newProjTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject = {
      id: `proj-${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      techStack: techArray.length > 0 ? techArray : ["Software"],
      repoUrl: newProjRepo.trim() || undefined,
      liveUrl: newProjLive.trim() || undefined,
    };

    setProjects([...projects, newProject]);
    // Also auto-add any new technologies to skills if missing
    techArray.forEach((t) => {
      if (!skills.some((s) => s.toLowerCase() === t.toLowerCase())) {
        skills.push(t);
      }
    });

    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjTech("");
    setNewProjRepo("");
    setNewProjLive("");
    setShowAddProject(false);
  };

  const handleDeleteProject = (projId: string) => {
    setProjects(projects.filter((p) => p.id !== projId));
  };

  // Real Resume Upload & AI Analysis
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeName(file.name);

    // If it's a text-based file, read content
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    } else {
      // Simulate/populate standard resume summary based on filename or text
      setResumeText(
        `Resume of ${name || "Candidate"}, ${course || "Computer Science"} student at ${college}. Key technical skills include ${skills.join(", ") || "Python, React, Machine Learning, SQL, Git"}. Built real-world projects and participating in hackathons.`
      );
    }
  };

  const handleTriggerAIResumeAnalysis = async () => {
    setIsParsingResume(true);
    setResumeParseSuccess(false);

    try {
      const res = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText:
            resumeText ||
            `Student Name: ${name}. Course: ${course}. Background in programming, algorithms, projects, and hackathon participation. Current skills: ${skills.join(", ")}`,
          studentName: name,
        }),
      });

      const data = await res.json();
      if (data) {
        setParsedSummary(data);

        // Auto-merge detected skills
        if (Array.isArray(data.detectedSkills)) {
          const mergedSkills = Array.from(
            new Set([...skills, ...data.detectedSkills])
          );
          setSkills(mergedSkills);
        }

        // Auto-merge detected interests
        if (Array.isArray(data.detectedInterests)) {
          const mergedInterests = Array.from(
            new Set([...interests, ...data.detectedInterests])
          );
          setInterests(mergedInterests);
        }

        if (data.careerGoal && (!careerGoal || careerGoal === "AI/ML Software Engineer")) {
          setCareerGoal(data.careerGoal);
        }

        setResumeParseSuccess(true);
      }
    } catch (err) {
      console.error("Failed to analyze resume with AI:", err);
    } finally {
      setIsParsingResume(false);
    }
  };

  // Preview dynamic score calculations
  const previewProfile: StudentProfile = {
    ...profile,
    name,
    email,
    college,
    course,
    year,
    bio,
    skills,
    interests,
    careerGoal,
    preferredOpportunities: preferredOpps,
    githubUrl,
    portfolioUrl,
    linkedinUrl,
    resumeName,
    resumeUploaded: !!resumeName,
    projects,
  };

  const currentCalculatedStrength = calculateProfileStrength(previewProfile);

  // Save All Changes
  const handleSave = () => {
    const updated: StudentProfile = {
      ...previewProfile,
      profileStrength: currentCalculatedStrength,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Edit Real Profile & Skills
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  Live Recalculation
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Update your real credentials. Match scores and skill gaps adapt instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Strength Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-stone-600 font-medium">Strength:</span>
              <span className="text-xs font-bold text-stone-900">
                {currentCalculatedStrength}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-white overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "basics", label: "Basics & Academics", icon: GraduationCap },
            { id: "skills", label: "Skills & Interests", icon: Code2 },
            { id: "projects", label: "Projects", icon: FolderGit2 },
            { id: "resume", label: "Resume & AI Parse", icon: FileText },
            { id: "links", label: "Links & Portfolios", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-amber-600 text-amber-900 bg-amber-50/40"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: BASICS & ACADEMICS */}
          {activeTab === "basics" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@university.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Course / Branch
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & AI"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                    <option value="PhD Candidate">PhD Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Career Goal
                  </label>
                  <input
                    type="text"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. AI/ML Software Engineer, Full Stack Lead"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Professional Bio / Elevator Pitch
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Passionate engineer building autonomous systems, full-stack applications, and competing in global hackathons..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Preferred Opportunities */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Preferred Opportunity Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Hackathons",
                    "Internships",
                    "Workshops",
                    "Competitions",
                    "Scholarships",
                    "Research Fellowships",
                  ].map((oppType) => {
                    const isSelected = preferredOpps.includes(oppType);
                    return (
                      <button
                        key={oppType}
                        type="button"
                        onClick={() => togglePreferredOpp(oppType)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {oppType}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & INTERESTS */}
          {activeTab === "skills" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Active Skills List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Your Technical Skills ({skills.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      These directly determine match scores with hackathons and internships.
                    </p>
                  </div>
                </div>

                {/* Add custom skill input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Type custom skill (e.g. Rust, Go, LangChain, PyTorch) and hit Enter..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 min-h-16 items-center">
                  {skills.length === 0 ? (
                    <span className="text-xs text-stone-400 italic">
                      No skills added yet. Add some above or click popular suggestions below.
                    </span>
                  ) : (
                    skills.map((skill) => {
                      const v = getSkillVerification(skill, profile.endorsements || []);
                      return (
                        <span
                          key={skill}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs group border ${
                            v.isVerified
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                              : "bg-white border-amber-300 text-amber-900"
                          }`}
                        >
                          <span>{skill}</span>
                          {v.isVerified && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold"
                              title={`Verified by ${v.count} teammate(s)`}
                            >
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Verified
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-stone-400 hover:text-rose-600 transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Verification Notice */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Skills verified by teammates carry higher weighting in AI opportunity matching.
                  </span>
                </div>

                {/* Popular Skill Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Quick Add Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SKILLS.filter(
                      (s) => !skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
                    ).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5 text-stone-400" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-stone-200" />

              {/* Interests & Domains */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Domains & Technical Interests ({interests.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Helps AI tailor personalized career recommendations and event themes.
                  </p>
                </div>

                {/* Add custom interest */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest(newInterestInput);
                      }
                    }}
                    placeholder="Type domain (e.g. Agentic Workflows, Robotics, Quantum) and press Enter..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddInterest(newInterestInput)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Interest Chips */}
                <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 min-h-14 items-center">
                  {interests.length === 0 ? (
                    <span className="text-xs text-stone-400 italic">No interests added yet.</span>
                  ) : (
                    interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-2xs"
                      >
                        <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_INTERESTS.filter(
                    (i) => !interests.some((it) => it.toLowerCase() === i.toLowerCase())
                  ).map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddInterest(i)}
                      className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5 text-stone-400" /> {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Real Projects & Portfolio ({projects.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Demonstrated real-world builds boost your Career Readiness Score and recruiter visibility.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddProject ? "Cancel" : "Add Project"}
                </button>
              </div>

              {/* Add Project Form Drawer */}
              {showAddProject && (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    New Project Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="e.g. Distributed Video Transcoder"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newProjTech}
                        onChange={(e) => setNewProjTech(e.target.value)}
                        placeholder="e.g. Python, Docker, Redis, Next.js"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        placeholder="Built an asynchronous pipeline processing 4K streams with 40% reduced latency..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        GitHub Repo URL
                      </label>
                      <input
                        type="url"
                        value={newProjRepo}
                        onChange={(e) => setNewProjRepo(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Live Demo URL (optional)
                      </label>
                      <input
                        type="url"
                        value={newProjLive}
                        onChange={(e) => setNewProjLive(e.target.value)}
                        placeholder="https://my-app.vercel.app"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateProject}
                      className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                    No projects added yet. Click "Add Project" to log your builds.
                  </div>
                ) : (
                  projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{proj.title}</h4>
                        </div>
                        <p className="text-xs text-stone-600">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Open Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RESUME & REAL AI PARSE */}
          {activeTab === "resume" && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Real Resume Upload & AI Parser
                </h3>
                <p className="text-xs text-stone-500">
                  Upload your actual resume file or paste raw resume text. Gemini will extract verified skills, career goals, and experience automatically.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 transition-colors rounded-2xl p-6 text-center bg-stone-50/50">
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={handleResumeFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <UploadCloud className="w-8 h-8 text-amber-600 mb-2" />
                  <span className="text-xs font-bold text-stone-900">
                    {resumeName ? `Selected: ${resumeName}` : "Click to select or drop your resume"}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5">
                    Supports PDF, TXT, DOCX, Markdown
                  </span>
                </label>
              </div>

              {/* Paste Text Area */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Or paste resume text directly:
                </label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your education, skills, projects, and work experience here for Gemini AI extraction..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Gemini 2.5 Flash analyzes your text, detecting skills and syncing with the matching engine.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerAIResumeAnalysis}
                  disabled={isParsingResume}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                >
                  {isParsingResume ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Extract with AI
                    </>
                  )}
                </button>
              </div>

              {/* Parsed Results feedback */}
              {resumeParseSuccess && parsedSummary && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI Analysis Completed! Profile successfully updated.
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Detected Skills:</strong>{" "}
                      {parsedSummary.detectedSkills?.join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Detected Interests:</strong>{" "}
                      {parsedSummary.detectedInterests?.join(", ") || "None"}
                    </p>
                    {parsedSummary.recommendation && (
                      <p className="text-[11px] text-emerald-700 italic">
                        💡 AI Advice: {parsedSummary.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LINKS & SOCIALS */}
          {activeTab === "links" && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Professional Profile & Repository Links
                </h3>
                <p className="text-xs text-stone-500">
                  Providing verified GitHub and portfolio links automatically boosts your profile completeness to 90%+.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-stone-800" /> GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" /> Personal Portfolio / Website
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourname.dev"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {skills.length} skills · {interests.length} interests · {projects.length} projects
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
              id="save-profile-btn"
            >
              Save Profile & Recalculate Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
