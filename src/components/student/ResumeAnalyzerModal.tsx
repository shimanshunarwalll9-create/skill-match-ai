import React, { useState } from "react";
import {
  X,
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Brain,
  ArrowRight,
  Loader2,
  TrendingUp,
  Award,
  Check,
} from "lucide-react";
import { ResumeAnalysisResult } from "../../types";

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtractedSkills: (skills: string[]) => void;
  currentResumeName?: string;
}

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onApplyExtractedSkills,
  currentResumeName = "Rahul_Sharma_Resume_2026.pdf",
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState(currentResumeName);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>({
    overallScore: 84,
    candidateName: "Rahul Sharma",
    detectedSkills: [
      "Python",
      "PyTorch",
      "SQL",
      "Machine Learning",
      "Scikit-Learn",
      "Git",
      "Linux",
      "NumPy",
    ],
    detectedInterests: ["Generative AI", "Computer Vision", "Backend Development"],
    detectedExperience: [
      "Smart India Hackathon 2025 Finalist (Face Recognition system)",
      "ML Researcher - University Campus Club",
    ],
    strengths: [
      "Explicit technical depth in Python and mathematical optimization",
      "Quantified achievements from national competitive hackathons",
      "Solid database and version control foundations",
    ],
    improvements: [
      "Add containerization and deployment links (Docker, Cloud Run)",
      "Quantify latency and inference speedups on GPU training",
      "Include unit testing frameworks (pytest)",
    ],
    careerGoalSuggestion: "AI/ML Software Engineer & Research Associate",
    keywordsMatched: ["Python", "Machine Learning", "PyTorch", "SQL", "Git"],
    keywordsMissing: ["FastAPI", "Docker", "Vector DB", "Kubernetes", "AWS/GCP"],
  });

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        overallScore: 88,
        candidateName: "Rahul Sharma",
        detectedSkills: [
          "Python",
          "PyTorch",
          "SQL",
          "Machine Learning",
          "FastAPI",
          "Git",
          "Scikit-Learn",
          "Docker",
        ],
        detectedInterests: ["Generative AI", "Computer Vision", "Cloud Infrastructure"],
        detectedExperience: [
          "Smart India Hackathon 2025 Finalist",
          "Neural Scale Tech Open Source Contributor",
        ],
        strengths: [
          "Demonstrated production API design and async worker pipelines",
          "Top-tier algorithmic problem solving credentials",
        ],
        improvements: [
          "Add live links to deployed portfolio demos",
          "Highlight model evaluation metrics (F1-score, Precision/Recall)",
        ],
        careerGoalSuggestion: "Full-Stack AI Engineer",
        keywordsMatched: ["Python", "FastAPI", "PyTorch", "Docker", "SQL"],
        keywordsMissing: ["Kubernetes", "Vector DB", "CI/CD Actions"],
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  AI Document Intelligence
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Resume ATS Evaluator
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                Resume Analyzer & Keyword Extractor
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Upload or Paste Toggle */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl max-w-xs">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "upload"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "paste"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          {activeTab === "upload" ? (
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors bg-stone-50/50">
              <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-800">
                {fileName ? fileName : "Upload Resume (PDF, DOCX, TXT)"}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                File size up to 10MB · ATS compliant parser
              </div>
              <input
                type="file"
                id="resume-modal-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    handleStartAnalysis();
                  }
                }}
              />
              <label
                htmlFor="resume-modal-upload"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Choose File & Re-Analyze
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the raw text of your resume or CV here..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                onClick={handleStartAnalysis}
                disabled={!rawText.trim() || isAnalyzing}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Analysis
                  </>
                )}
              </button>
            </div>
          )}

          {/* Analysis Results View */}
          {analysisResult && (
            <div className="space-y-6 pt-4 border-t border-stone-200 animate-in fade-in">
              {/* Score & Goal Suggestion */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 to-stone-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-amber-400 leading-none">
                      {analysisResult.overallScore}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 mt-0.5">
                      / 100
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Overall Resume ATS Score
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      Recommended Goal: {analysisResult.careerGoalSuggestion}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplyExtractedSkills(analysisResult.detectedSkills);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  Sync Extracted Skills to Profile
                </button>
              </div>

              {/* Detected Skills Chips */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Detected Skills ({analysisResult.detectedSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.detectedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-1 text-xs text-emerald-900 list-disc list-inside">
                    {analysisResult.strengths.map((st, i) => (
                      <li key={i} className="leading-relaxed">
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    High-Value Improvements
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
                    {analysisResult.improvements.map((imp, i) => (
                      <li key={i} className="leading-relaxed">
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing ATS Keywords */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Missing Keywords for Target Role
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.keywordsMissing.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-medium"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
