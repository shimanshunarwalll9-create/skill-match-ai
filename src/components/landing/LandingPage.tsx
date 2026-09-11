import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  ClipboardList,
  Trophy,
  Bot,
  Brain,
  CheckCircle2,
  Check,
  ChevronRight,
  Star,
  Users,
  Layers,
  GraduationCap,
  Building2,
  TrendingUp,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreOpportunities: () => void;
  onLoginDemoAccount: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreOpportunities,
  onLoginDemoAccount,
  onOpenLogin,
}) => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(2);

  const pipelineSteps = [
    {
      id: 0,
      title: "1. Student Profile",
      subtitle: "Verified Skills & Projects",
      badge: "Input",
      color: "border-stone-300 bg-white",
      details: "Extracts verified skills (Python, PyTorch, SQL), coursework, GitHub repos, and hackathon experience.",
      icon: GraduationCap,
    },
    {
      id: 1,
      title: "2. AI Analysis",
      subtitle: "Multi-factor Scoring",
      badge: "Gemini 2.5",
      color: "border-amber-300 bg-amber-50/50",
      details: "Performs contextual semantic matching against employer rubrics, evaluating technical depth, coursework, and interests.",
      icon: Brain,
    },
    {
      id: 2,
      title: "3. Skill Match",
      subtitle: "Explainable 92% Match",
      badge: "Intelligence",
      color: "border-emerald-300 bg-emerald-50/50",
      details: "Calculates mathematical compatibility, breaks down matching vs missing skills, and explains why it fits.",
      icon: Target,
    },
    {
      id: 3,
      title: "4. Opportunity",
      subtitle: "Internships & Hackathons",
      badge: "Outcome",
      color: "border-stone-900 bg-stone-900 text-white",
      details: "Curated hackathons, competitive fellowships, and internships with targeted 30-day preparation roadmaps.",
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 tracking-tight text-lg">
                  SkillMatch
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  AI
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-stone-900 transition-colors">
              Features
            </a>
            <a href="#pipeline" className="hover:text-stone-900 transition-colors">
              Matching Pipeline
            </a>
            <a href="#stats" className="hover:text-stone-900 transition-colors">
              Metrics
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLoginDemoAccount}
              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Instant Hackathon Judge Access"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span className="hidden sm:inline">Hackathon</span> Demo Mode
            </button>

            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Log In
            </button>

            <button
              onClick={onGetStarted}
              className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-amber-50/40 via-white to-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            AI-Powered Career Readiness & Opportunity Matching
            <span className="text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded text-[10px] font-bold">
              Hackathon Edition
            </span>
          </div>

          {/* Core Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
            Turn Your Skills Into Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800">
              Next Opportunity.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-stone-600 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
            SkillMatch AI analyzes your skills, finds opportunities that fit you, identifies your skill gaps, and helps you become career-ready.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-10">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreOpportunities}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm transition-all border border-stone-300 shadow-2xs flex items-center justify-center gap-2"
            >
              Explore Opportunities
            </button>
          </div>

          {/* Judge Quick Tip */}
          <div className="inline-flex items-center gap-2 text-xs text-stone-500 bg-amber-50/70 border border-amber-200/80 px-3.5 py-1.5 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Hackathon Judges: Click</span>
            <button
              onClick={onLoginDemoAccount}
              className="text-amber-800 underline font-bold hover:text-amber-950"
            >
              Try 1-Click Demo Account
            </button>
            <span>to explore pre-populated Rahul Sharma's AI profile & matches.</span>
          </div>
        </div>

        {/* Visual Pipeline Section */}
        <div id="pipeline" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-100 gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Interactive AI Architecture
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  How the SkillMatch Engine Connects Every Step
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Click each node to see real pipeline details
              </p>
            </div>

            {/* Pipeline Step Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {pipelineSteps.map((step) => {
                const Icon = step.icon;
                const isActive = activePipelineStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActivePipelineStep(step.id)}
                    className={`text-left p-4 rounded-xl border transition-all text-sm relative ${
                      isActive
                        ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {step.badge}
                      </span>
                    </div>
                    <div className="font-bold text-stone-900 text-sm">{step.title}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{step.subtitle}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Explainer Card */}
            <div className="mt-6 p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Step {activePipelineStep + 1} Deep Dive: {pipelineSteps[activePipelineStep].title}
                  </h4>
                  <p className="text-sm text-stone-700 mt-0.5">
                    {pipelineSteps[activePipelineStep].details}
                  </p>
                </div>
              </div>
              <button
                onClick={onGetStarted}
                className="self-end sm:self-center px-3.5 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold whitespace-nowrap hover:bg-stone-800 transition-colors"
              >
                Experience Live →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              5-Step Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-3">
              How SkillMatch AI Works
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              From raw resume keywords to winning hackathons and securing top tech internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: "1",
                title: "Build Your Profile",
                desc: "Upload resume or input your coursework, skills, and projects in 2 minutes.",
              },
              {
                num: "2",
                title: "AI Analyzes Skills",
                desc: "Engine extracts technical depth, frameworks, and generates your 87/100 readiness score.",
              },
              {
                num: "3",
                title: "Discover Matches",
                desc: "Get personalized hackathons and internships with transparent 92% match scores.",
              },
              {
                num: "4",
                title: "Identify Skill Gaps",
                desc: "See exactly what you're missing (e.g. TensorFlow, Docker) to reach 100% eligibility.",
              },
              {
                num: "5",
                title: "Improve & Track",
                desc: "Follow 30-day learning tasks, track applications, and view performance history.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 relative flex flex-col justify-between hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-2xs">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-3">
              Engineered for Complete Career Acceleration
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Everything in SkillMatch AI directly connects to your skills and updates your real-time readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Brain,
                title: "AI Skill Analysis",
                desc: "Calculates overall 87/100 score with granular breakdown across technical, soft, and tool categories.",
              },
              {
                icon: Sparkles,
                title: "Smart Opportunity Matching",
                desc: "Real-time mathematical compatibility scoring against live hackathons, jobs, and internships.",
              },
              {
                icon: Target,
                title: "Explainable Match Scores",
                desc: "Transparent breakdown: Why it's a 92% match, matched skills (✓), and weak skills (⚠️).",
              },
              {
                icon: BarChart3,
                title: "Skill Gap Detection",
                desc: "Side-by-side gap analyzer comparing your stack with targeted requirements (e.g. 72% → 89%).",
              },
              {
                icon: BookOpen,
                title: "Personalized Learning Plans",
                desc: "Structured 30-day roadmap with weekly milestones that boost your match score as you complete tasks.",
              },
              {
                icon: Trophy,
                title: "Performance Tracking",
                desc: "Centralized record of hackathons, competitions, ranks (#12 of 240), and verified badges.",
              },
              {
                icon: ClipboardList,
                title: "Application Tracking",
                desc: "Kanban board tracking statuses from Saved and Applied to Interview and Selected with notes.",
              },
              {
                icon: Bot,
                title: "AI Career Assistant",
                desc: "Tailored career copilot answering questions, suggesting projects, and reviewing resumes via Gemini.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benchmark Statistics Section (Labeled Sample/Demo Data) */}
      <section id="stats" className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-stone-900">
              Platform Verification Benchmarks
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Sample metrics evaluated across prototype benchmark test sets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-700">
                92%
              </div>
              <div className="font-semibold text-stone-900 text-sm mt-2">
                Average Match Accuracy
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Validated against opportunity requirements rubrics (sample data)
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-4xl sm:text-5xl font-extrabold text-stone-900">
                500+
              </div>
              <div className="font-semibold text-stone-900 text-sm mt-2">
                Opportunities Cataloged
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Hackathons, tech internships, research grants, and competitions
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                10K+
              </div>
              <div className="font-semibold text-stone-900 text-sm mt-2">
                Skills Analyzed
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Taxonomy mapping across tech stacks, frameworks, and domains
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="py-14 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <blockquote className="text-xl sm:text-2xl font-medium leading-snug">
            “SkillMatch AI doesn't just tell you what opportunities exist. It tells you which opportunities are right for <span className="text-amber-400 font-bold">YOU</span>, <span className="text-amber-400 font-bold">WHY</span> they are right, <span className="text-amber-400 font-bold">WHAT</span> you're missing, and <span className="text-amber-400 font-bold">HOW</span> to become ready for them.”
          </blockquote>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors shadow-sm"
            >
              Start Your AI Career Profile
            </button>
            <button
              onClick={onLoginDemoAccount}
              className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm transition-colors border border-stone-700"
            >
              Explore Live Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-stone-50 border-t border-stone-200 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">SkillMatch AI</span>
            <span>· Intelligent Career Acceleration Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLoginDemoAccount} className="hover:text-stone-900 font-medium">
              Demo Mode
            </button>
            <button onClick={onOpenLogin} className="hover:text-stone-900 font-medium">
              Sign In
            </button>
            <button onClick={onGetStarted} className="hover:text-stone-900 font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
