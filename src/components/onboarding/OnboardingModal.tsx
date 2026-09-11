import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  UploadCloud,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Brain,
  Star,
} from "lucide-react";
import { StudentProfile, SkillScoreItem } from "../../types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (
    updatedProfile: Partial<StudentProfile>,
    newSkills: SkillScoreItem[]
  ) => void;
  initialProfile: StudentProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  initialProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Basic Info
  const [name, setName] = useState(initialProfile.name || "Rahul Sharma");
  const [college, setCollege] = useState(initialProfile.college || "Indian Institute of Technology / Campus Hub");
  const [course, setCourse] = useState(initialProfile.course || "B.Tech Computer Science");
  const [degree, setDegree] = useState("Bachelor of Technology (B.Tech)");
  const [gradYear, setGradYear] = useState(initialProfile.year || "2027");

  // Step 2: Skills with Proficiency
  const [skillsList, setSkillsList] = useState<
    { name: string; proficiency: "Beginner" | "Intermediate" | "Advanced"; category: "technical" | "frameworks" | "tools" | "domain" | "soft" }[]
  >([
    { name: "Python", proficiency: "Advanced", category: "technical" },
    { name: "SQL", proficiency: "Advanced", category: "technical" },
    { name: "Machine Learning", proficiency: "Intermediate", category: "domain" },
    { name: "PyTorch", proficiency: "Intermediate", category: "frameworks" },
    { name: "Git", proficiency: "Advanced", category: "tools" },
    { name: "Communication", proficiency: "Advanced", category: "soft" },
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Step 3: Experience
  const [experiences, setExperiences] = useState<string[]>([
    "Smart India Hackathon 2025 (Top 10 Finalist)",
    "Built 'SmartAttend' face-recognition Python project",
    "Campus Google Developer Student Club - Core Member",
  ]);
  const [newExpInput, setNewExpInput] = useState("");

  // Step 4: Interests
  const [interests, setInterests] = useState<string[]>([
    "AI/ML",
    "Generative AI",
    "Hackathons",
    "Web Development",
    "Software Development",
  ]);
  const availableInterests = [
    "AI/ML",
    "Generative AI",
    "Web Development",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "Software Development",
    "UI/UX",
    "Open Source",
    "DevOps",
  ];

  // Step 5: Resume upload & AI analysis
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>(initialProfile.resumeName || "Resume_2026.pdf");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    if (skillsList.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    let cat: "technical" | "frameworks" | "tools" | "domain" | "soft" = "technical";
    const lower = trimmed.toLowerCase();
    if (["react", "pytorch", "fastapi", "django", "node.js", "tensorflow", "vue"].some((f) => lower.includes(f))) cat = "frameworks";
    else if (["git", "docker", "kubernetes", "postman", "linux", "jira"].some((t) => lower.includes(t))) cat = "tools";
    else if (["communication", "leadership", "teamwork", "pitching"].some((s) => lower.includes(s))) cat = "soft";
    else if (["ai", "machine learning", "cloud", "security", "data science"].some((d) => lower.includes(d))) cat = "domain";

    setSkillsList([...skillsList, { name: trimmed, proficiency: newSkillProf, category: cat }]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (nameToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s.name !== nameToRemove));
  };

  const handleAddExp = () => {
    const trimmed = newExpInput.trim();
    if (trimmed && !experiences.includes(trimmed)) {
      setExperiences([...experiences, trimmed]);
      setNewExpInput("");
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleFinishOnboarding = async () => {
    setIsAnalyzing(true);
    setAnalysisText("Analyzing your profile with SkillMatch AI...");

    // Simulated progress steps for smooth UX
    setTimeout(() => {
      setAnalysisText("Extracting verified skills and project achievements...");
    }, 800);

    setTimeout(() => {
      setAnalysisText("Calculating overall SkillMatch Score (87/100)...");
    }, 1600);

    setTimeout(() => {
      const updatedProfileData: Partial<StudentProfile> = {
        name,
        college,
        course,
        year: gradYear,
        skills: skillsList.map((s) => s.name),
        interests,
        resumeName,
        resumeUploaded: true,
        profileStrength: 87,
        careerReadiness: 81,
      };

      const convertedSkillScores: SkillScoreItem[] = skillsList.map((s, idx) => ({
        id: `sk-onboard-${idx}`,
        name: s.name,
        score: s.proficiency === "Advanced" ? 88 : s.proficiency === "Intermediate" ? 75 : 62,
        proficiency: s.proficiency,
        category: s.category,
        verified: true,
      }));

      setIsAnalyzing(false);
      onCompleteOnboarding(updatedProfileData, convertedSkillScores);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Step {step} of 5
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {step === 1 && "Basic Information"}
                {step === 2 && "Skills & Proficiency"}
                {step === 3 && "Experience & Projects"}
                {step === 4 && "Career Interests"}
                {step === 5 && "Resume & AI Generation"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Personalize Your SkillMatch Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-stone-200 h-1">
          <div
            className="bg-amber-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-sm text-stone-600 mb-2">
                Let's start with your academic background to tune opportunity eligibility.
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Rahul Sharma"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Delhi Technological University"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Degree Program
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Graduation Year / Status
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="1st Year">1st Year (2028)</option>
                    <option value="2nd Year">2nd Year (2027)</option>
                    <option value="3rd Year">3rd Year (2026)</option>
                    <option value="Final Year">Final Year (2025)</option>
                    <option value="Recent Graduate">Recent Graduate (2024)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Proficiency */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-sm text-stone-600 mb-1">
                Add skills with your self-assessed proficiency. The AI matching system weighs these against opportunity requirements.
              </div>

              {/* Add Skill Row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="e.g. React, Docker, Machine Learning..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <select
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Skill Chips List */}
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 shadow-2xs"
                  >
                    <span>{skill.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        skill.proficiency === "Advanced"
                          ? "bg-emerald-100 text-emerald-800"
                          : skill.proficiency === "Intermediate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {skill.proficiency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="text-stone-400 hover:text-red-600 transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-xs text-stone-400 mt-2">
                Popular suggestions: React, Node.js, TensorFlow, Docker, Kubernetes, Java, C++, TypeScript, SQL, Figma
              </div>
            </div>
          )}

          {/* STEP 3: Experience & Projects */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-sm text-stone-600 mb-2">
                Highlight hackathons, internships, projects, or certifications you've completed.
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExpInput}
                  onChange={(e) => setNewExpInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExp();
                    }
                  }}
                  placeholder="e.g. SIH 2025 Finalist, Built ML Face Detection project..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddExp}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-800"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{exp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Career Interests */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-sm text-stone-600 mb-2">
                Select the career domains and technical tracks you are most excited about:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableInterests.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-2xs"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Resume & AI Skill Profile Generation */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto animate-pulse shadow-sm">
                    <Brain className="w-7 h-7 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Generating Your AI Skill Profile
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {analysisText}
                  </p>
                  <div className="w-48 mx-auto bg-stone-200 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-amber-600 h-full rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-stone-600">
                    Upload your resume for automatic verification, or continue with your structured inputs to generate your AI profile.
                  </div>

                  {/* Drag-and-drop box */}
                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors bg-stone-50/50">
                    <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <div className="text-sm font-bold text-stone-800">
                      Upload Resume (PDF, DOCX, TXT)
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Drag & drop here or click to browse
                    </div>
                    <input
                      type="file"
                      id="onboard-resume-input"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setResumeFile(file);
                          setResumeName(file.name);
                        }
                      }}
                    />
                    <label
                      htmlFor="onboard-resume-input"
                      className="inline-block mt-3 px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs"
                    >
                      Choose File
                    </label>
                  </div>

                  {resumeName && (
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span className="font-medium">{resumeName}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                        Ready for AI Extraction
                      </span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                    <strong>Next:</strong> SkillMatch AI will generate your <strong>Overall SkillMatch Score (87/100)</strong>, calculate opportunity matches, and build your personalized 30-day learning roadmap.
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isAnalyzing && (
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4" /> Generate AI Skill Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
