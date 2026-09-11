import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Sparkles,
  Trophy,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { LearningTask, StudentProfile } from "../../types";

interface LearningPlanViewProps {
  learningTasks: LearningTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<LearningTask, "id" | "completed">) => void;
  profile: StudentProfile;
}

export const LearningPlanView: React.FC<LearningPlanViewProps> = ({
  learningTasks,
  onToggleTask,
  onAddTask,
  profile,
}) => {
  const [activeWeek, setActiveWeek] = useState<number | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("TensorFlow");
  const [week, setWeek] = useState(1);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [estimatedTime, setEstimatedTime] = useState("6 hours");
  const [resourceType, setResourceType] = useState("Interactive Lab");
  const [xpReward, setXpReward] = useState(150);

  const completedCount = learningTasks.filter((t) => t.completed).length;
  const totalCount = learningTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalXPEarned = learningTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.xpReward || 100), 0);

  const filteredTasks = learningTasks.filter((t) => activeWeek === "all" || t.week === activeWeek);

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        week,
        title: title.trim(),
        skill: skill.trim(),
        difficulty,
        estimatedTime,
        resourceType,
        xpReward,
      });
      setTitle("");
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Tailored 30-Day Upskilling Plan
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Personalized Learning Plan
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              Curated modules systematically targeted to resolve gaps in your profile for {profile.careerGoal}. Completing tasks immediately elevates your SkillMatch readiness score and awards experience XP.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl p-5 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600 leading-none">
                {progressPercent}%
              </div>
              <div className="text-[10px] uppercase font-bold text-stone-500 mt-1">
                Completed
              </div>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div>
              <div className="text-xs font-bold text-stone-900">
                {completedCount} of {totalCount} Tasks Done
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                +{totalXPEarned} XP Earned
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-stone-600">
            <span>30-Day Milestone Progress</span>
            <span className="font-bold text-stone-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveWeek("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeWeek === "all"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              All 4 Weeks
            </button>
            {[1, 2, 3, 4].map((w) => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeWeek === w
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                Week {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Task
          </button>
        </div>
      </div>

      {/* 2. Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? "border-stone-200 bg-stone-50/50 opacity-80"
                  : "border-stone-200 shadow-2xs hover:shadow-xs hover:border-amber-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    task.completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-stone-300 hover:border-amber-500 bg-white"
                  }`}
                  title={task.completed ? "Mark as in progress" : "Mark as completed"}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      Week {task.week}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {task.skill}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        task.difficulty === "Advanced"
                          ? "bg-red-50 text-red-700"
                          : task.difficulty === "Intermediate"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {task.difficulty}
                    </span>
                    {task.completed && (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm font-bold ${
                      task.completed ? "line-through text-stone-500" : "text-stone-900"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {task.estimatedTime}
                    </span>
                    <span>·</span>
                    <span>{task.resourceType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-600">
                    +{task.xpReward} XP
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    task.completed
                      ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      : "bg-stone-900 hover:bg-stone-800 text-white shadow-2xs"
                  }`}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Add Learning Milestone</h3>
            <p className="text-xs text-stone-500 mb-4">
              Schedule targeted study or hands-on practice into your weekly roadmap.
            </p>

            <form onSubmit={handleSubmitNewTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build an LLM RAG Pipeline with LangChain"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Skill
                  </label>
                  <input
                    type="text"
                    required
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="e.g. PyTorch"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Week
                  </label>
                  <select
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value={1}>Week 1</option>
                    <option value={2}>Week 2</option>
                    <option value={3}>Week 3</option>
                    <option value={4}>Week 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g. 5 hours"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Resource Type
                </label>
                <input
                  type="text"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  placeholder="e.g. Hands-on Tutorial, Video Lab, Capstone"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
