

//onboardingform.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Briefcase, Award, CheckCircle2, ArrowRight, Mail } from "lucide-react";

const EXPERIENCE_LEVELS = [
  { value: "FRESHER", label: "Fresher", description: "Starting my career journey" },
  { value: "JUNIOR", label: "Junior", description: "0-2 years of experience" },
  { value: "MID", label: "Mid-Level", description: "2-5 years of experience" },
  { value: "SENIOR", label: "Senior", description: "5+ years of experience" },
];

const JOB_ROLES = [
  { value: "SDE", label: "Software Development Engineer", icon: "💻" },
  { value: "FRONTEND", label: "Frontend Developer", icon: "🎨" },
  { value: "BACKEND", label: "Backend Developer", icon: "⚙️" },
  { value: "FULLSTACK", label: "Full Stack Developer", icon: "🚀" },
  { value: "DATA_ANALYST", label: "Data Analyst", icon: "📊" },
  { value: "DATA_SCIENTIST", label: "Data Scientist", icon: "🔬" },
  { value: "ML_ENGINEER", label: "ML Engineer", icon: "🤖" },
];

const SKILLS = [
  { value: "DSA", label: "Data Structures & Algorithms", color: "from-blue-500 to-cyan-500" },
  { value: "WEB_DEVELOPMENT", label: "Web Development", color: "from-purple-500 to-pink-500" },
  { value: "PROJECTS", label: "Projects", color: "from-green-500 to-emerald-500" },
  { value: "SYSTEM_DESIGN", label: "System Design", color: "from-orange-500 to-red-500" },
  { value: "MACHINE_LEARNING", label: "Machine Learning", color: "from-indigo-500 to-purple-500" },
  { value: "DATA_ANALYSIS", label: "Data Analysis", color: "from-cyan-500 to-blue-500" },
  { value: "STATISTICS", label: "Statistics", color: "from-pink-500 to-rose-500" },
  { value: "SQL", label: "SQL", color: "from-emerald-500 to-teal-500" },
];

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    experience: "",
    roles: [] as string[],
    skills: [] as string[],
  });

  const handleRoleToggle = (role: string) => {
    if (formData.roles.includes(role)) {
      setFormData({ ...formData, roles: formData.roles.filter((r) => r !== role) });
    } else if (formData.roles.length < 3) {
      setFormData({ ...formData, roles: [...formData.roles, role] });
    } else {
      setError("You can select maximum 3 job roles");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.experience) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formData.roles.length === 0) {
      setError("Please select at least one job role");
      return;
    }
    
    if (formData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
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

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Step {currentStep} of {totalSteps}</span>
          <span className="text-blue-400 font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Full Name */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">What's your name?</h3>
          </div>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter your full name"
          />
        </div>
      )}

      {/* Step 2: Email */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">What's your email?</h3>
          </div>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter your email address"
          />
        </div>
      )}

      {/* Step 3: Experience Level */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">What's your experience level?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData({ ...formData, experience: level.value })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.experience === level.value
                    ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="font-semibold text-white mb-1">{level.label}</div>
                <div className="text-sm text-slate-400">{level.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Job Roles */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Select your job roles</h3>
            </div>
            <span className="text-sm text-slate-400">
              {formData.roles.length}/3 selected
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {JOB_ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleToggle(role.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  formData.roles.includes(role.value)
                    ? "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                <span className="text-2xl">{role.icon}</span>
                <span className="text-white font-medium flex-1">{role.label}</span>
                {formData.roles.includes(role.value) && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Skills */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-semibold text-white">What skills do you want to improve?</h3>
            </div>
            <span className="text-sm text-slate-400">
              {formData.skills.length} selected
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SKILLS.map((skill) => (
              <button
                key={skill.value}
                type="button"
                onClick={() => handleSkillToggle(skill.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  formData.skills.includes(skill.value)
                    ? "border-transparent shadow-lg"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                {formData.skills.includes(skill.value) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-20`} />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="text-white font-medium">{skill.label}</span>
                  {formData.skills.includes(skill.value) && (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all"
          >
            Previous
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1 && !formData.fullName) {
                setError("Please enter your name");
                return;
              }
              if (currentStep === 2 && !formData.email) {
                setError("Please enter your email");
                return;
              }
              if (currentStep === 2 && !validateEmail(formData.email)) {
                setError("Please enter a valid email address");
                return;
              }
              if (currentStep === 3 && !formData.experience) {
                setError("Please select your experience level");
                return;
              }
              setError("");
              setCurrentStep(currentStep + 1);
            }}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Profile</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(30 41 59 / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(71 85 105 / 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105 / 0.7);
        }
      `}</style>
    </form>
  );
}