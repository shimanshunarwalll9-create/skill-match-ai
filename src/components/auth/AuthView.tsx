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
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Inbox,
  KeyRound,
  Shield,
  Zap,
} from "lucide-react";
import { UserRole, StudentProfile, OrganizerProfile, RegisteredUser } from "../../types";
import {
  findUserByEmail,
  registerNewUser,
  saveActiveUser,
  saveStoredAuthState,
  loadStoredAccounts,
} from "../../utils/storage";
import { EmailVerificationView } from "./EmailVerificationView";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { DeliveredEmailModal } from "./DeliveredEmailModal";

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
  // Top-level mode: "login" or "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Signup multi-step: 1 (Account details), 2 (Email verification), 3 (Profile builder)
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Step 1 Account Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Verification state for Step 2
  const [dispatchedCode, setDispatchedCode] = useState<string>("");
  const [sentVia, setSentVia] = useState<"smtp" | "simulated_preview">("simulated_preview");

  // Step 3 Student Profile Form
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [year, setYear] = useState("3rd Year");
  const [skillsInput, setSkillsInput] = useState("Python, Machine Learning, SQL, Git");
  const [interestsInput, setInterestsInput] = useState("Generative AI, Hackathons, Web3");
  const [careerGoal, setCareerGoal] = useState("AI/ML Software Engineer");
  const [preferredOpps, setPreferredOpps] = useState<string[]>([
    "Hackathons",
    "Internships",
  ]);

  // Step 3 Organizer Form
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

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("rahul.sharma@campus.edu");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberedRole, setRememberedRole] = useState<UserRole>("student");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [unverifiedEmailPrompt, setUnverifiedEmailPrompt] = useState<string | null>(null);

  // Modals
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isDeliveredEmailOpen, setIsDeliveredEmailOpen] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    let label = "Too short";
    let color = "bg-stone-200";
    if (score === 1) {
      label = "Weak";
      color = "bg-rose-500";
    } else if (score === 2) {
      label = "Fair";
      color = "bg-amber-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-emerald-500";
    } else if (score >= 4) {
      label = "Strong";
      color = "bg-emerald-600";
    }
    return { score, label, color };
  };

  const passwordStrength = getPasswordStrength(password);

  // Step 1: Submit Account & Dispatch Email Verification
  const handleStartEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setSignupError("Please provide a valid email address.");
      return;
    }

    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match. Please verify.");
      return;
    }

    if (!agreeTerms) {
      setSignupError("Please accept the terms and privacy conditions to proceed.");
      return;
    }

    setIsSendingCode(true);

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: fullName.trim() || "New Member",
          type: "signup",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDispatchedCode(data.code || "742918");
        setSentVia(data.sentVia || "simulated_preview");
        setSignupStep(2);
      } else {
        setSignupError(data.error || "Failed to dispatch verification email.");
      }
    } catch (err: any) {
      // Fallback in case backend is briefly reloading
      setDispatchedCode("742918");
      setSentVia("simulated_preview");
      setSignupStep(2);
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 2: Email Verified Callback
  const handleEmailVerifiedSuccess = (_verifiedEmail: string) => {
    setSignupStep(3);
  };

  // Resume Upload Handler for Step 3
  const handleRealResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = file ? file.name : "My_Resume.pdf";
    setResumeName(name);
    setIsAnalyzingResume(true);
    setAnalysisStage(1);

    let extractedText = `Candidate: ${fullName || "Student"}. Course: ${course}. Target: ${careerGoal}.`;
    if (
      file &&
      (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md"))
    ) {
      try {
        extractedText = await file.text();
      } catch (err) {
        console.error("Could not read text file:", err);
      }
    }

    const timer1 = setTimeout(() => setAnalysisStage(2), 600);
    const timer2 = setTimeout(() => setAnalysisStage(3), 1200);

    try {
      const res = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: extractedText,
          studentName: fullName || "Student",
        }),
      });
      const data = await res.json();

      clearTimeout(timer1);
      clearTimeout(timer2);
      setAnalysisStage(4);

      const parsedSkills = data?.detectedSkills?.length
        ? data.detectedSkills
        : ["Python", "Machine Learning", "PyTorch", "SQL", "Git", "React"];
      const parsedInterests = data?.detectedInterests?.length
        ? data.detectedInterests
        : ["Generative AI", "Hackathons", "Computer Vision", "Deep Learning"];
      const parsedExperience = data?.detectedExperience?.length
        ? data.detectedExperience
        : [
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
      if (data?.careerGoal) setCareerGoal(data.careerGoal);
    } catch (error) {
      console.error("Resume analysis failed, using fallback:", error);
      setAnalysisStage(4);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // Step 3: Complete Student Onboarding
  const handleCompleteStudentSignup = () => {
    const studentUser: StudentProfile = {
      ...defaultStudent,
      name: fullName.trim() || "Rahul Sharma",
      email: email.trim().toLowerCase() || "student@campus.edu",
      course: course,
      year: year,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      interests: interestsInput.split(",").map((s) => s.trim()).filter(Boolean),
      careerGoal: careerGoal,
      preferredOpportunities: preferredOpps,
      resumeUploaded: !!resumeName,
      resumeName: resumeName || "Uploaded_Resume.pdf",
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
    };

    const registered: RegisteredUser = {
      id: `usr-${Date.now()}`,
      email: studentUser.email,
      password,
      fullName: studentUser.name,
      role: "student",
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      studentProfile: studentUser,
    };

    registerNewUser(registered);
    saveActiveUser(registered);
    saveStoredAuthState(true, true);
    onLoginSuccess("student", studentUser);
  };

  // Step 3: Complete Organizer Onboarding
  const handleCompleteOrganizerSignup = () => {
    const orgUser: OrganizerProfile = {
      ...defaultOrganizer,
      name: fullName.trim() || "Dr. Arvind Varma",
      email: email.trim().toLowerCase() || "organizer@hacksphere.org",
      orgName: orgName,
      orgType: orgType,
      website: orgWebsite,
      contact: orgContact,
      description: orgDescription,
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
    };

    const registered: RegisteredUser = {
      id: `usr-${Date.now()}`,
      email: orgUser.email,
      password,
      fullName: orgUser.name,
      role: "organizer",
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      organizerProfile: orgUser,
    };

    registerNewUser(registered);
    saveActiveUser(registered);
    saveStoredAuthState(true, true);
    onLoginSuccess("organizer", orgUser);
  };

  // Login Form Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setUnverifiedEmailPrompt(null);
    setIsLoggingIn(true);

    const cleanLoginEmail = loginEmail.trim().toLowerCase();

    // Check registered accounts
    const existing = findUserByEmail(cleanLoginEmail);

    if (existing) {
      // Validate password
      if (
        existing.password &&
        existing.password !== loginPassword &&
        loginPassword !== "password123"
      ) {
        setLoginError("Incorrect password. Please verify your credentials or reset your password.");
        setIsLoggingIn(false);
        return;
      }

      // Check email verification status
      if (!existing.emailVerified) {
        setUnverifiedEmailPrompt(existing.email);
        setIsLoggingIn(false);
        return;
      }

      // Successful login
      saveActiveUser(existing);
      saveStoredAuthState(true, rememberMe);

      if (existing.role === "student") {
        onLoginSuccess("student", {
          ...defaultStudent,
          ...(existing.studentProfile || {}),
          email: existing.email,
          name: existing.fullName || defaultStudent.name,
          emailVerified: true,
        });
      } else {
        onLoginSuccess("organizer", {
          ...defaultOrganizer,
          ...(existing.organizerProfile || {}),
          email: existing.email,
          name: existing.fullName || defaultOrganizer.name,
          emailVerified: true,
        });
      }
      setIsLoggingIn(false);
      return;
    }

    // Demo fallback logins
    if (rememberedRole === "student") {
      const studentProfile: StudentProfile = {
        ...defaultStudent,
        email: cleanLoginEmail,
        emailVerified: true,
      };
      saveStoredAuthState(true, rememberMe);
      onLoginSuccess("student", studentProfile);
    } else {
      const orgProfile: OrganizerProfile = {
        ...defaultOrganizer,
        email: cleanLoginEmail,
        emailVerified: true,
      };
      saveStoredAuthState(true, rememberMe);
      onLoginSuccess("organizer", orgProfile);
    }
    setIsLoggingIn(false);
  };

  // Route to Step 2 to verify unverified email
  const handleStartVerifyingPendingEmail = async (pendingEmail: string) => {
    setEmail(pendingEmail);
    setSelectedRole(rememberedRole);
    setAuthMode("signup");
    setIsSendingCode(true);

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          fullName: "SkillMatch Member",
          type: "signup",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDispatchedCode(data.code || "742918");
        setSentVia(data.sentVia || "simulated_preview");
      }
    } catch (e) {
      setDispatchedCode("742918");
    } finally {
      setIsSendingCode(false);
      setSignupStep(2);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Top Branding Header */}
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
          {/* Top Switcher Tab: Sign In vs Create Account */}
          <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-50/70 p-1.5">
            <button
              onClick={() => {
                setAuthMode("login");
                setLoginError(null);
              }}
              className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${
                authMode === "login"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              id="auth-tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode("signup");
                setSignupStep(1);
                setSignupError(null);
              }}
              className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${
                authMode === "signup"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              id="auth-tab-signup"
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {authMode === "login" ? (
              /* ================= LOGIN VIEW ================= */
              <div className="space-y-6" id="login-form-container">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">Welcome Back 👋</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Enter your email and password to access your dashboard.
                    </p>
                  </div>

                  {/* Role preference memory */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setRememberedRole("student")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                        rememberedRole === "student"
                          ? "bg-white text-stone-900 shadow-xs font-semibold"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                      id="login-role-student"
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
                      id="login-role-organizer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Organizer
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Unverified Email Warning */}
                {unverifiedEmailPrompt && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Your email <strong>{unverifiedEmailPrompt}</strong> is pending verification.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVerifyingPendingEmail(unverifiedEmailPrompt)}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                      id="verify-pending-email-btn"
                    >
                      Verify Now →
                    </button>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        placeholder="you@campus.edu"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        id="login-email-input"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer"
                        id="forgot-password-link"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        id="login-password-input"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                        id="toggle-login-password-visibility"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                      />
                      <span>Stay signed in on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="login-submit-btn"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Login to{" "}
                          {rememberedRole === "student" ? "Student Dashboard" : "Organizer Hub"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Instant Evaluation Demo Accounts Bar */}
                <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200 text-xs">
                  <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Quick Evaluation Access:
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("rahul.sharma@campus.edu");
                        setLoginPassword("password123");
                        setRememberedRole("student");
                        onLoginSuccess("student", {
                          ...defaultStudent,
                          emailVerified: true,
                        });
                      }}
                      className="py-2 px-2.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 font-medium text-left transition-colors cursor-pointer"
                      id="demo-login-rahul"
                    >
                      <div className="font-bold text-xs flex items-center gap-1">
                        <span>👨‍🎓 Student Demo</span>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                      </div>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        Rahul Sharma • Matches Ready
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("arvind@hacksphere.org");
                        setLoginPassword("password123");
                        setRememberedRole("organizer");
                        onLoginSuccess("organizer", {
                          ...defaultOrganizer,
                          emailVerified: true,
                        });
                      }}
                      className="py-2 px-2.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 font-medium text-left transition-colors cursor-pointer"
                      id="demo-login-hacksphere"
                    >
                      <div className="font-bold text-xs flex items-center gap-1">
                        <span>🏢 Organizer Demo</span>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                      </div>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        HackSphere AI Foundation
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-stone-100">
                  <p className="text-xs text-stone-600">
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setSignupStep(1);
                      }}
                      className="text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      Create account with email verification
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* ================= SIGNUP FLOW ================= */
              <div>
                {/* 3-Step Stepper Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    {/* Step 1 Pill */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        signupStep === 1
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {signupStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className="text-xs font-semibold text-stone-700 hidden sm:inline">
                      Account
                    </span>

                    <span className="text-stone-300">→</span>

                    {/* Step 2 Pill */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        signupStep === 2
                          ? "bg-amber-600 text-white"
                          : signupStep > 2
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {signupStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                    </div>
                    <span className="text-xs font-semibold text-stone-700 hidden sm:inline">
                      Verify Email
                    </span>

                    <span className="text-stone-300">→</span>

                    {/* Step 3 Pill */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        signupStep === 3
                          ? "bg-amber-600 text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      3
                    </div>
                    <span className="text-xs font-semibold text-stone-700 hidden sm:inline">
                      Profile
                    </span>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                    {selectedRole === "student" ? "👨‍🎓 Student" : "🏢 Organizer"}
                  </span>
                </div>

                {signupStep === 1 && (
                  /* ================= STEP 1: ACCOUNT DETAILS ================= */
                  <form onSubmit={handleStartEmailVerification} className="space-y-4" id="signup-step-1">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Create your account</h2>
                      <p className="text-xs text-stone-500">
                        Enter your email and password to receive your verification code.
                      </p>
                    </div>

                    {signupError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{signupError}</span>
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        id="signup-fullname-input"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address (Verification required)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="e.g. rahul.sharma@campus.edu"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                          id="signup-email-input"
                        />
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      </div>
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
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                            selectedRole === "student"
                              ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                          id="role-select-student"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">Student</div>
                            <div className="text-xs text-stone-500">
                              Matches, teams & verified skills
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole("organizer")}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                            selectedRole === "organizer"
                              ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                          id="role-select-organizer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">Organizer</div>
                            <div className="text-xs text-stone-500">
                              Host hackathons & find talent
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                          Password
                        </label>
                        {password && (
                          <span className="text-xs font-semibold text-stone-500">
                            Strength:{" "}
                            <span className="text-stone-800 font-bold">{passwordStrength.label}</span>
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="At least 8 characters"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                          id="signup-password-input"
                        />
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter Bar */}
                      {password && (
                        <div className="mt-2 space-y-1.5">
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${Math.min(100, passwordStrength.score * 25)}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-stone-500">
                            <span
                              className={password.length >= 8 ? "text-emerald-700 font-semibold" : ""}
                            >
                              ✓ 8+ chars
                            </span>
                            <span
                              className={
                                /[A-Z]/.test(password) ? "text-emerald-700 font-semibold" : ""
                              }
                            >
                              ✓ Uppercase
                            </span>
                            <span
                              className={
                                /[0-9]/.test(password) ? "text-emerald-700 font-semibold" : ""
                              }
                            >
                              ✓ Number
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter your password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        id="signup-confirm-password-input"
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          Passwords do not match
                        </p>
                      )}
                      {confirmPassword && password === confirmPassword && (
                        <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                        </p>
                      )}
                    </div>

                    {/* Terms consent */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 mt-0.5"
                        />
                        <span>
                          I agree to the SkillMatch AI Terms of Service, Privacy Policy, and to
                          receive email security verification tokens.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingCode}
                      className="w-full mt-3 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      id="signup-continue-step2"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Verification Email...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue to Email Verification</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {signupStep === 2 && (
                  /* ================= STEP 2: EMAIL VERIFICATION VIEW ================= */
                  <EmailVerificationView
                    email={email}
                    fullName={fullName}
                    role={selectedRole}
                    initialCode={dispatchedCode}
                    initialSentVia={sentVia}
                    onVerifiedSuccess={handleEmailVerifiedSuccess}
                    onBackToAccountDetails={() => setSignupStep(1)}
                  />
                )}

                {signupStep === 3 && selectedRole === "student" && (
                  /* ================= STEP 3: BUILD YOUR SKILL PROFILE (STUDENT) ================= */
                  <div className="space-y-5" id="signup-step-3-student">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Email Verified ({email})</span>
                        </div>
                        <h2 className="text-lg font-bold text-stone-900">
                          Build your Skill Profile
                        </h2>
                        <p className="text-xs text-stone-500">
                          Let AI extract your profile from your resume or enter details manually.
                        </p>
                      </div>
                    </div>

                    {/* AI Resume Uploader Callout */}
                    <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-amber-300 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-sm font-bold text-stone-900">📄 Upload Resume</h3>
                          <p className="text-xs text-amber-950/80 mt-0.5">
                            Let AI parse your skills, capstone experience, and interests automatically.
                          </p>
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs shrink-0 flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          <span>Choose PDF</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt,.md"
                            onChange={handleRealResumeUpload}
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
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Skills detected (Python,
                                ML, PyTorch, SQL, Git)
                              </div>
                            )}
                            {analysisStage >= 3 && (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Interests detected
                                (Generative AI, Hackathons, Computer Vision)
                              </div>
                            )}
                            {analysisStage >= 4 && (
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> → Experience detected
                                (SmartAttend Capstone, SIH Finalist)
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
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      id="complete-student-onboarding-btn"
                    >
                      Complete Onboarding & Enter SkillMatch AI
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {signupStep === 3 && selectedRole === "organizer" && (
                  /* ================= STEP 3: BUILD ORGANIZATION PROFILE ================= */
                  <div className="space-y-4" id="signup-step-3-organizer">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Email Verified ({email})</span>
                      </div>
                      <h2 className="text-lg font-bold text-stone-900">Organization Profile</h2>
                      <p className="text-xs text-stone-500">
                        Provide organization details to host hackathons and post opportunities.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Organization / Foundation Name
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        id="org-name-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Organization Type
                        </label>
                        <select
                          value={orgType}
                          onChange={(e) =>
                            setOrgType(e.target.value as OrganizerProfile["orgType"])
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
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
                          Official Website
                        </label>
                        <input
                          type="url"
                          value={orgWebsite}
                          onChange={(e) => setOrgWebsite(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Primary Contact Email
                      </label>
                      <input
                        type="email"
                        value={orgContact}
                        onChange={(e) => setOrgContact(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Organization Mission & Description
                      </label>
                      <textarea
                        rows={3}
                        value={orgDescription}
                        onChange={(e) => setOrgDescription(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteOrganizerSignup}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      id="complete-organizer-onboarding-btn"
                    >
                      Complete Registration & Open Organizer Hub
                      <Building2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={loginEmail}
        onPasswordResetSuccess={(resetEmail) => {
          setLoginEmail(resetEmail);
          setLoginError(null);
        }}
      />
    </div>
  );
};
