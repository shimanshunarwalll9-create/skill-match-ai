import React, { useState } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { UserRole, StudentProfile, OrganizerProfile } from "../../types";

interface AuthViewProps {
  onLoginSuccess: (role: UserRole, user: StudentProfile | OrganizerProfile) => void;
  defaultStudent: StudentProfile;
  defaultOrganizer: OrganizerProfile;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  defaultStudent,
  defaultOrganizer,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Step 1 Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  // Step 2 Student Form
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [year, setYear] = useState("3rd Year");
  const [skillsInput, setSkillsInput] = useState("Python, Machine Learning, SQL, Git");
  const [interestsInput, setInterestsInput] = useState("Generative AI, Hackathons, Web3");
  const [careerGoal, setCareerGoal] = useState("AI/ML Software Engineer");
  const [preferredOpps, setPreferredOpps] = useState<string[]>([
    "Hackathons",
    "Internships",
  ]);

  // Step 2 Organizer Form
  const [orgName, setOrgName] = useState("NextGen Tech Labs");
  const [orgType, setOrgType] = useState<OrganizerProfile["orgType"]>("Tech Company");
  const [orgWebsite, setOrgWebsite] = useState("https://nextgen-labs.io");
  const [orgContact, setOrgContact] = useState("hr@nextgen-labs.io");
  const [orgDescription, setOrgDescription] = useState(
    "Incubator and university partner organizing high-impact AI hackathons and recruiting emerging engineering talent."
  );

  // Resume Upload & AI Analysis State
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [detectedSummary, setDetectedSummary] = useState<{
    skills: string[];
    interests: string[];
    experience: string[];
  } | null>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState("rahul.sharma@campus.edu");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [rememberedRole, setRememberedRole] = useState<UserRole>("student");

  const handleSimulatedResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = file ? file.name : "Rahul_Sharma_Resume.pdf";
    setResumeName(name);
    setIsAnalyzingResume(true);
    setAnalysisStage(1);

    // Staged animation:
    // 1: AI is analyzing your profile...
    // 2: Skills detected
    // 3: Interests detected
    // 4: Experience detected
    setTimeout(() => {
      setAnalysisStage(2);
    }, 900);

    setTimeout(() => {
      setAnalysisStage(3);
    }, 1800);

    setTimeout(() => {
      setAnalysisStage(4);
      const parsedSkills = [
        "Python",
        "Machine Learning",
        "PyTorch",
        "SQL",
        "Git",
        "React",
        "Scikit-Learn",
      ];
      const parsedInterests = [
        "Generative AI",
        "Hackathons",
        "Computer Vision",
        "Deep Learning",
      ];
      const parsedExperience = [
        "SmartAttend Face Recognition (College capstone)",
        "Core Tech Member @ Campus Developer Student Club",
        "Top 10 Finalist @ Smart India Hackathon 2025",
      ];

      setDetectedSummary({
        skills: parsedSkills,
        interests: parsedInterests,
        experience: parsedExperience,
      });

      setSkillsInput(parsedSkills.join(", "));
      setInterestsInput(parsedInterests.join(", "));
      setCareerGoal("AI/ML Engineer & Researcher");
      setIsAnalyzingResume(false);
    }, 2800);
  };

  const handleCompleteStudentSignup = () => {
    const studentUser: StudentProfile = {
      ...defaultStudent,
      name: fullName || "Rahul Sharma",
      email: email || "student@campus.edu",
      course: course,
      year: year,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      interests: interestsInput.split(",").map((s) => s.trim()).filter(Boolean),
      careerGoal: careerGoal,
      preferredOpportunities: preferredOpps,
      resumeUploaded: !!resumeName,
      resumeName: resumeName || "Uploaded_Resume.pdf",
    };
    onLoginSuccess("student", studentUser);
  };

  const handleCompleteOrganizerSignup = () => {
    const orgUser: OrganizerProfile = {
      ...defaultOrganizer,
      name: fullName || "Dr. Arvind Varma",
      email: email || "organizer@hacksphere.org",
      orgName: orgName,
      orgType: orgType,
      website: orgWebsite,
      contact: orgContact,
      description: orgDescription,
    };
    onLoginSuccess("organizer", orgUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberedRole === "student") {
      onLoginSuccess("student", {
        ...defaultStudent,
        email: loginEmail,
      });
    } else {
      onLoginSuccess("organizer", {
        ...defaultOrganizer,
        email: loginEmail,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Top Branding Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-600 text-white shadow-md mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            SkillMatch AI
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
            Find opportunities that match who you are.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Top Switcher Tab: Sign Up vs Login */}
          <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-50/70 p-1.5">
            <button
              onClick={() => {
                setAuthMode("signup");
                setSignupStep(1);
              }}
              className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${
                authMode === "signup"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              id="auth-tab-signup"
            >
              Intelligent 2-Step Signup
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${
                authMode === "login"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              id="auth-tab-login"
            >
              Welcome Back Login
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {authMode === "login" ? (
              /* ================= 2. LOGIN PAGE ================= */
              <div className="space-y-6" id="login-form-container">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      Welcome back 👋
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Enter your credentials to access your personalized feed.
                    </p>
                  </div>
                  {/* Role preference memory */}
                  <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setRememberedRole("student")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                        rememberedRole === "student"
                          ? "bg-white text-stone-900 shadow-xs font-semibold"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRememberedRole("organizer")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                        rememberedRole === "organizer"
                          ? "bg-white text-stone-900 shadow-xs font-semibold"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Organizer
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="you@campus.edu or organizer@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      id="login-email-input"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert("Password reset link dispatched to " + loginEmail)}
                        className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      id="login-password-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    id="login-submit-btn"
                  >
                    Login to {rememberedRole === "student" ? "Student Dashboard" : "Organizer Hub"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-stone-400 font-semibold tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (rememberedRole === "student") {
                      onLoginSuccess("student", defaultStudent);
                    } else {
                      onLoginSuccess("organizer", defaultOrganizer);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                  id="login-google-btn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Instant Demo Accounts Switcher Bar */}
                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs">
                  <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Quick Hackathon Evaluation Access:
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onLoginSuccess("student", defaultStudent)}
                      className="py-1.5 px-2.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-950 font-medium text-left transition-colors"
                      id="demo-login-rahul"
                    >
                      👨‍🎓 Demo Student (Rahul)
                      <span className="block text-[10px] text-amber-700">
                        82% Profile Strength · Matches Ready
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLoginSuccess("organizer", defaultOrganizer)}
                      className="py-1.5 px-2.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-950 font-medium text-left transition-colors"
                      id="demo-login-hacksphere"
                    >
                      🏢 Demo Organizer (HackSphere)
                      <span className="block text-[10px] text-amber-700">
                        AI Audience Sizing & Event Creator
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-stone-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setSignupStep(1);
                      }}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* ================= 1. SIGNUP PAGE — 2-STEP ONBOARDING ================= */
              <div>
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        signupStep === 1
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {signupStep === 2 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className="text-xs font-semibold text-stone-700">
                      Step 1: Account
                    </span>
                    <span className="text-stone-300">→</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        signupStep === 2
                          ? "bg-amber-600 text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      2
                    </div>
                    <span className="text-xs font-semibold text-stone-700">
                      Step 2: {selectedRole === "student" ? "Skill Profile" : "Org Profile"}
                    </span>
                  </div>

                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {selectedRole === "student" ? "Student" : "Organizer"}
                  </span>
                </div>

                {signupStep === 1 ? (
                  /* ================= STEP 1: CREATE ACCOUNT ================= */
                  <div className="space-y-4" id="signup-step-1">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">
                        Create your account
                      </h2>
                      <p className="text-xs text-stone-500">
                        Find opportunities that match who you are.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        id="signup-fullname-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul.sharma@campus.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        id="signup-email-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a secure password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        id="signup-password-input"
                      />
                    </div>

                    {/* Role Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                        I am a:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRole("student")}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                            selectedRole === "student"
                              ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                          id="role-select-student"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">
                              👨‍🎓 Student
                            </div>
                            <div className="text-xs text-stone-500">
                              Discover matches, find teammates & track growth
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole("organizer")}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                            selectedRole === "organizer"
                              ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                          id="role-select-organizer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">
                              🏢 Organizer
                            </div>
                            <div className="text-xs text-stone-500">
                              Host hackathons, target audience & review matches
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      id="signup-continue-step2"
                    >
                      Continue to Step 2: Build Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : selectedRole === "student" ? (
                  /* ================= STEP 2: BUILD YOUR SKILL PROFILE (STUDENT) ================= */
                  <div className="space-y-5" id="signup-step-2-student">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-stone-900">
                          Build your Skill Profile
                        </h2>
                        <p className="text-xs text-stone-500">
                          Let AI build your profile automatically or enter details manually.
                        </p>
                      </div>
                      <button
                        onClick={() => setSignupStep(1)}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>

                    {/* AI Resume Uploader Callout */}
                    <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-amber-300 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-sm font-bold text-stone-900">
                            📄 Upload Resume
                          </h3>
                          <p className="text-xs text-amber-950/80 mt-0.5">
                            Let AI build your profile automatically in seconds.
                          </p>
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs shrink-0 flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          <span>Choose PDF</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleSimulatedResumeUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* AI Analyzing Indicator */}
                      {isAnalyzingResume && (
                        <div className="mt-4 pt-3 border-t border-amber-200 text-xs space-y-2 animate-in fade-in">
                          <div className="flex items-center gap-2 font-bold text-amber-900">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                            🤖 AI is analyzing your profile...
                          </div>
                          <div className="space-y-1.5 pl-6 text-stone-700 font-medium">
                            {analysisStage >= 2 && (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Skills detected (Python, ML, PyTorch, SQL, Git)
                              </div>
                            )}
                            {analysisStage >= 3 && (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Interests detected (Generative AI, Hackathons, Computer Vision)
                              </div>
                            )}
                            {analysisStage >= 4 && (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Experience detected (SmartAttend Capstone, SIH Finalist)
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Resume Uploaded Badge */}
                      {detectedSummary && !isAnalyzingResume && (
                        <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold">
                              AI parsed {resumeName} successfully!
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700">
                            +15% Profile Boost
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Manual Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Course / Branch
                        </label>
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Year of Study
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year / Final</option>
                          <option>Postgraduate / Masters</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="Python, Machine Learning, React, SQL..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Interests
                      </label>
                      <input
                        type="text"
                        value={interestsInput}
                        onChange={(e) => setInterestsInput(e.target.value)}
                        placeholder="Generative AI, Hackathons, Robotics, FinTech..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Career Goal
                      </label>
                      <input
                        type="text"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="AI/ML Engineer, Fullstack Architect..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Preferred Opportunities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Hackathons", "Internships", "Workshops", "Competitions", "Fellowships"].map(
                          (pref) => {
                            const isSelected = preferredOpps.includes(pref);
                            return (
                              <button
                                key={pref}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setPreferredOpps(preferredOpps.filter((p) => p !== pref));
                                  } else {
                                    setPreferredOpps([...preferredOpps, pref]);
                                  }
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                  isSelected
                                    ? "bg-stone-900 text-white shadow-xs"
                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                              >
                                {pref} {isSelected && "✓"}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteStudentSignup}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                      id="complete-student-onboarding-btn"
                    >
                      Complete Onboarding & Enter SkillMatch AI
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* ================= STEP 2: BUILD ORGANIZATION PROFILE (ORGANIZER) ================= */
                  <div className="space-y-4" id="signup-step-2-organizer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-stone-900">
                          Organization Profile
                        </h2>
                        <p className="text-xs text-stone-500">
                          Set up your organizer brand to publish events & reach matched students.
                        </p>
                      </div>
                      <button
                        onClick={() => setSignupStep(1)}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Organization name
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="HackSphere AI Foundation"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Organization type
                        </label>
                        <select
                          value={orgType}
                          onChange={(e) =>
                            setOrgType(e.target.value as OrganizerProfile["orgType"])
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                          <option>Tech Company</option>
                          <option>University</option>
                          <option>Community</option>
                          <option>Incubator</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={orgWebsite}
                          onChange={(e) => setOrgWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Contact Email / Phone
                      </label>
                      <input
                        type="text"
                        value={orgContact}
                        onChange={(e) => setOrgContact(e.target.value)}
                        placeholder="events@company.com or +1 (555) 0192"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={orgDescription}
                        onChange={(e) => setOrgDescription(e.target.value)}
                        placeholder="Tell students about your company mission and types of opportunities you host..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteOrganizerSignup}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                      id="complete-organizer-onboarding-btn"
                    >
                      Complete Organizer Setup & View AI Audience
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SkillMatch AI uses end-to-end privacy and verified profile matching</span>
        </div>
      </div>
    </div>
  );
};
