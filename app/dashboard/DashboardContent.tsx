"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Target, 
  Award, 
  Code, 
  Zap,
  Star,
  Trophy,
  Edit2,
  Save,
  X,
  Mail,
  User,
  Briefcase,
  Shield,
  CheckCircle,
  Calendar
} from "lucide-react";
import Link from "next/link";
import DailyTaskModal from "../components/DailyTaskModal/DailyTaskModal";

const JOB_ROLES = [
  { value: "SDE", label: "Software Development Engineer", icon: "💻" },
  { value: "FRONTEND", label: "Frontend Developer", icon: "🎨" },
  { value: "BACKEND", label: "Backend Developer", icon: "⚙️" },
  { value: "FULLSTACK", label: "Full Stack Developer", icon: "🚀" },
  { value: "DATA_ANALYST", label: "Data Analyst", icon: "📊" },
  { value: "DATA_SCIENTIST", label: "Data Scientist", icon: "🔬" },
  { value: "ML_ENGINEER", label: "ML Engineer", icon: "🤖" },
];

const EXPERIENCE_LEVELS = [
  { value: "FRESHER", label: "Fresher" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-Level" },
  { value: "SENIOR", label: "Senior" },
];

const SKILLS = [
  { value: "DSA", label: "Data Structures & Algorithms" },
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "PROJECTS", label: "Projects" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "MACHINE_LEARNING", label: "Machine Learning" },
  { value: "DATA_ANALYSIS", label: "Data Analysis" },
  { value: "STATISTICS", label: "Statistics" },
  { value: "SQL", label: "SQL" },
];

interface DashboardContentProps {
  user: {
    id: string;
    fullName: string | null;
    email: string | null;
    experience: string | null;
    totalPoints: number;
    isSubscribed: boolean;
    roles: Array<{ role: string }>;
    skills: Array<{ skill: string; points: number }>;
  };
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDailyTaskModal, setShowDailyTaskModal] = useState(false);
  
  // FIX: State to hold calculated daily stats
  const [dailyTaskStats, setDailyTaskStats] = useState({
    pointsToday: 0,
    completedTasksToday: 0,
  });
  
  const [editedData, setEditedData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    experience: user.experience || "",
    roles: user.roles.map(r => r.role),
    skills: user.skills.map(s => s.skill),
  });

  // Fetch daily task stats
  useEffect(() => {
    fetchDailyTaskStats();
  }, []);

  const fetchDailyTaskStats = async () => {
    try {
      const response = await fetch("/api/daily-tasks");
      if (response.ok) {
        const data = await response.json();
        
        // FIX: Calculate stats from the new response structure
        // The API returns { todayEntry: { tasks: [], totalPoints: int }, ... }
        let points = 0;
        let completedCount = 0;

        if (data.todayEntry) {
           // Get points directly from the daily entry total
           points = data.todayEntry.totalPoints || 0;

           // Count completed tasks in the array
           if (Array.isArray(data.todayEntry.tasks)) {
             completedCount = data.todayEntry.tasks.filter((t: any) => t.completed).length;
           }
        }

        setDailyTaskStats({
          pointsToday: points,
          completedTasksToday: completedCount,
        });
      }
    } catch (error) {
      console.error("Error fetching daily task stats:", error);
    }
  };

  const handleRoleToggle = (role: string) => {
    if (editedData.roles.includes(role)) {
      setEditedData({ ...editedData, roles: editedData.roles.filter((r) => r !== role) });
    } else if (editedData.roles.length < 3) {
      setEditedData({ ...editedData, roles: [...editedData.roles, role] });
    } else {
      setError("You can select maximum 3 job roles");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (editedData.skills.includes(skill)) {
      setEditedData({ ...editedData, skills: editedData.skills.filter((s) => s !== skill) });
    } else {
      setEditedData({ ...editedData, skills: [...editedData.skills, skill] });
    }
  };

  const handleSave = async () => {
    if (!editedData.fullName || !editedData.email || !editedData.experience) {
      setError("Please fill in all required fields");
      return;
    }

    if (editedData.roles.length === 0) {
      setError("Please select at least one job role");
      return;
    }

    if (editedData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData({
      fullName: user.fullName || "",
      email: user.email || "",
      experience: user.experience || "",
      roles: user.roles.map(r => r.role),
      skills: user.skills.map(s => s.skill),
    });
    setIsEditing(false);
    setError("");
  };

  const formatSkillName = (skill: string) => {
    return skill.replace(/_/g, ' ');
  };

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 pt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">{user.fullName}</span>
              </h1>
              <p className="text-slate-400 mt-1">Here's what's happening with your learning journey</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Points */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user.totalPoints}</div>
              <div className="text-sm text-slate-400">Total Points</div>
            </div>
          </div>

          {/* Active Skills */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user.skills.length}</div>
              <div className="text-sm text-slate-400">Active Skills</div>
            </div>
          </div>

          {/* Daily Task Points */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              {/* FIX: Use the new state variable */}
              <div className="text-3xl font-bold text-white mb-1">{dailyTaskStats.pointsToday}</div>
              <div className="text-sm text-slate-400">Points Today</div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user.isSubscribed ? "Pro" : "Free"}</div>
              <div className="text-sm text-slate-400">Subscription Plan</div>
            </div>
          </div>
        </div>

        {/* Daily Tasks Section */}
        <div className="mb-12">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Daily Goals</h3>
                  <p className="text-slate-400 text-sm">Complete tasks to earn 3 points each</p>
                </div>
              </div>
              <button
                onClick={() => setShowDailyTaskModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all"
              >
                Manage Goals
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-400 text-sm">Points Earned Today</span>
                </div>
                {/* FIX: Use the new state variable */}
                <p className="text-2xl font-bold text-white">{dailyTaskStats.pointsToday}</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400 text-sm">Tasks Completed Today</span>
                </div>
                {/* FIX: Use the new state variable */}
                <p className="text-2xl font-bold text-white">{dailyTaskStats.completedTasksToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              Your Profile
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-medium transition-all flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 text-green-400 font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.fullName}
                      onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-3 bg-slate-800/30 rounded-xl">{user.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  ) : (
                    <p className="text-white font-medium px-4 py-3 bg-slate-800/30 rounded-xl">{user.email}</p>
                  )}
                </div>

                {/* User ID */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">User ID</label>
                  <p className="text-slate-500 font-mono text-sm px-4 py-3 bg-slate-800/30 rounded-xl">{user.id}</p>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Experience Level
                  </label>
                  {isEditing ? (
                    <select
                      value={editedData.experience}
                      onChange={(e) => setEditedData({ ...editedData, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-white font-medium px-4 py-3 bg-slate-800/30 rounded-xl capitalize">
                      {user.experience?.toLowerCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-400" />
                Job Roles {isEditing && <span className="text-sm text-slate-400">({editedData.roles.length}/3)</span>}
              </h3>
              
              {isEditing ? (
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
                  {JOB_ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleToggle(role.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                        editedData.roles.includes(role.value)
                          ? "bg-green-500/20 border-green-500"
                          : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-xl">{role.icon}</span>
                      <span className="text-white font-medium flex-1 text-sm">{role.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {user.roles.map((roleObj, i) => (
                    <div key={i} className="px-4 py-3 bg-slate-800/30 rounded-xl text-white font-medium">
                      {formatRoleName(roleObj.role)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Your Skills {isEditing && <span className="text-sm text-slate-400">({editedData.skills.length} selected)</span>}
          </h2>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SKILLS.map((skill) => (
                <button
                  key={skill.value}
                  type="button"
                  onClick={() => handleSkillToggle(skill.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    editedData.skills.includes(skill.value)
                      ? "bg-blue-500/20 border-blue-500"
                      : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <span className="text-white font-medium text-sm">{skill.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.skills.map((skill, index) => {
                const colors = [
                  { from: "from-blue-500", to: "to-cyan-500" },
                  { from: "from-purple-500", to: "to-pink-500" },
                  { from: "from-green-500", to: "to-emerald-500" },
                  { from: "from-orange-500", to: "to-red-500" },
                  { from: "from-indigo-500", to: "to-purple-500" },
                  { from: "from-cyan-500", to: "to-blue-500" },
                  { from: "from-pink-500", to: "to-rose-500" },
                  { from: "from-emerald-500", to: "to-teal-500" },
                ];
                const color = colors[index % colors.length];
                const progress = Math.min((skill.points / 1000) * 100, 100);

                return (
                  <div key={skill.skill} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">
                        {formatSkillName(skill.skill)}
                      </h3>
                      <span className="text-sm text-slate-400">{skill.points} pts</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full bg-gradient-to-r ${color.from} ${color.to} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      {Math.round(progress)}% to next level
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/learning"
              className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 
                         hover:bg-blue-500/20 transition-all text-left group block"
            >
              <Code className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-white font-medium mb-1">Start Learning</div>
              <div className="text-sm text-slate-400">Continue your journey</div>
            </Link>

            <Link
              href="/leaderboard"
              className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 
                         hover:bg-purple-500/20 transition-all text-left group block"
            >
              <Trophy className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-white font-medium mb-1">View Leaderboard</div>
              <div className="text-sm text-slate-400">See your ranking</div>
            </Link>

            <button
              onClick={() => setShowDailyTaskModal(true)}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 
                         hover:bg-green-500/20 transition-all text-left group"
            >
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-white font-medium mb-1">Set New Goals</div>
              <div className="text-sm text-slate-400">Track your progress</div>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Task Modal */}
      <DailyTaskModal 
        isOpen={showDailyTaskModal}
        onClose={() => setShowDailyTaskModal(false)}
        onTaskCreated={() => {
          fetchDailyTaskStats();
          window.location.reload();
        }}
      />
    </div>
  );
}