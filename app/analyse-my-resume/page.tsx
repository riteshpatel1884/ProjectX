'use client';

import { useState } from 'react';
import { Upload, FileText, Sparkles, TrendingUp, AlertCircle, CheckCircle, XCircle, Target, Zap, Award, Flag, Brain, MessageSquare, Plus, FileCheck, BarChart3, Eye, Layout, Code, Briefcase, GraduationCap, Star, ThumbsUp, ThumbsDown, ArrowRight, Lightbulb, TrendingDown } from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  additions: string[];
  deletions: string[];
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    matchPercentage?: number;
  };
  sectionFeedback: {
    section: string;
    score: number;
    feedback: string;
  }[];
  actionItems: string[];
  redFlags: string[];
  detailedAnalysis?: {
    formatting?: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    content?: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    experience?: {
      score: number;
      relevance: string;
      suggestions: string[];
    };
    skills?: {
      score: number;
      technical: string[];
      soft: string[];
      missing: string[];
    };
    education?: {
      score: number;
      alignment: string;
      suggestions: string[];
    };
  };
}

export default function ResumeAnalyser() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    jobType: '',
    jobDescription: '',
    experienceLevel: '',
    yearsOfExperience: '',
    requiredSkills: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume');
      return;
    }

    if (!formData.jobType || !formData.jobDescription || !formData.experienceLevel) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', file);
      formDataToSend.append('jobType', formData.jobType);
      formDataToSend.append('jobDescription', formData.jobDescription);
      formDataToSend.append('experienceLevel', formData.experienceLevel);
      formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
      formDataToSend.append('requiredSkills', formData.requiredSkills);
      formDataToSend.append('companyName', formData.companyName);

      const response = await fetch('/api/analyse-my-resume', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFormData({
      jobType: '',
      jobDescription: '',
      experienceLevel: '',
      yearsOfExperience: '',
      requiredSkills: '',
      companyName: '',
    });
    setResult(null);
    setError('');
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => {
    const circumference = 2 * Math.PI * 58;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="relative group">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white">{score}</div>
          <div className="text-xs text-gray-400 mt-1">out of 100</div>
        </div>
        <div className="mt-3 text-center text-sm text-gray-300 font-medium">{label}</div>
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1625] via-[#2d1b4e] to-[#1a1625] relative">
      {/* Top Navigation Bar */}
      <nav className="pt-24">
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">AI Resume Analyzer</h1>
              <div className="flex items-center gap-2 text-sm text-purple-400">
                <Zap className="w-4 h-4" />
                <span>AI last updated (25 Dec, 2025)</span>
              </div>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="rounded-3xl p-4 shadow-2xl border border-purple-900/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Upload Resume <span className="text-pink-500">*</span>
                </label>
                <div 
                  className="relative border-2 border-dashed border-purple-800/50 hover:border-purple-600/50 rounded-2xl p-8 transition-all cursor-pointer bg-[#1f1630]/50 group"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-300 font-medium mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">PDF or DOCX (max 5MB)</p>
                    {file && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">File uploaded successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Type <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    required
                  >
                    <option value="" className="bg-[#1f1630]">Select type</option>
                    <option value="full-time" className="bg-[#1f1630]">Full-Time Job</option>
                    <option value="internship" className="bg-[#1f1630]">Internship</option>
                    <option value="contract" className="bg-[#1f1630]">Contract</option>
                    <option value="part-time" className="bg-[#1f1630]">Part-Time</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience Level <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    required
                  >
                    <option value="" className="bg-[#1f1630]">Select level</option>
                    <option value="fresher" className="bg-[#1f1630]">Fresher (0 years)</option>
                    <option value="entry" className="bg-[#1f1630]">Entry Level (1-2 years)</option>
                    <option value="mid" className="bg-[#1f1630]">Mid Level (3-5 years)</option>
                    <option value="senior" className="bg-[#1f1630]">Senior Level (6-10 years)</option>
                    <option value="expert" className="bg-[#1f1630]">Expert (10+ years)</option>
                  </select>
                </div>
              </div>

              {formData.experienceLevel !== 'fresher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>
              )}

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description <span className="text-pink-500">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Paste the complete job description here..."
                  className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Required Skills
                  </label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    placeholder="JavaScript, React, Node.js, AWS"
                    className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Google, Microsoft, etc."
                    className="w-full px-4 py-3 bg-[#1f1630]/80 border border-purple-800/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing Your Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Insights
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Cards */}
            <div className="flex justify-center gap-12 mb-8">
              <ScoreCircle score={result.overallScore} label="Overall Score" />
              <ScoreCircle score={result.atsScore} label="ATS Score" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#2a1f3d] rounded-2xl p-4 border border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.strengths.length}</div>
                    <div className="text-xs text-gray-400">Strengths</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#2a1f3d] rounded-2xl p-4 border border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <ThumbsDown className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.weaknesses.length}</div>
                    <div className="text-xs text-gray-400">Improvements</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#2a1f3d] rounded-2xl p-4 border border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {result.keywordAnalysis.matchPercentage || Math.round((result.keywordAnalysis.matched.length / (result.keywordAnalysis.matched.length + result.keywordAnalysis.missing.length)) * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Keyword Match</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#2a1f3d] rounded-2xl p-4 border border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Flag className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.redFlags.length}</div>
                    <div className="text-xs text-gray-400">Red Flags</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section-by-Section Analysis */}
            {result.sectionFeedback && result.sectionFeedback.length > 0 && (
              <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Section-by-Section Analysis</h3>
                </div>
                <div className="space-y-4">
                  {result.sectionFeedback.map((section, index) => (
                    <div key={index} className="bg-[#1f1630]/50 rounded-xl p-5 border border-purple-800/30">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-purple-400" />
                          {section.section}
                        </h4>
                        <div className={`px-3 py-1 rounded-lg border ${getScoreBgColor(section.score)}`}>
                          <span className={`text-sm font-bold ${getScoreColor(section.score)}`}>
                            {section.score}/100
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights Header */}
            <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Insights</h2>
                    <p className="text-sm text-purple-400">⚡ Lightning-fast recommendations</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Strengths */}
                {result.strengths.length > 0 && (
                  <div className="bg-[#1f1630]/50 rounded-2xl p-5 border border-green-900/30">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {result.weaknesses.length > 0 && (
                  <div className="bg-[#1f1630]/50 rounded-2xl p-5 border border-orange-900/30">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-orange-400 mt-0.5">⚠</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* What to Add & Remove */}
            {(result.additions.length > 0 || result.deletions.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Additions */}
                {result.additions.length > 0 && (
                  <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">What to Add</h3>
                    </div>
                    <ul className="space-y-3">
                      {result.additions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300 bg-[#1f1630]/50 rounded-lg p-3">
                          <ArrowRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deletions */}
                {result.deletions.length > 0 && (
                  <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">What to Remove</h3>
                    </div>
                    <ul className="space-y-3">
                      {result.deletions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300 bg-[#1f1630]/50 rounded-lg p-3">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Keyword Analysis */}
            <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Keyword Analysis</h3>
                  <p className="text-sm text-gray-400">
                    Match Rate: {result.keywordAnalysis.matchPercentage || Math.round((result.keywordAnalysis.matched.length / (result.keywordAnalysis.matched.length + result.keywordAnalysis.missing.length)) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Matched Keywords ({result.keywordAnalysis.matched.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.matched.map((keyword, index) => (
                      <span key={index} className="px-3 py-1.5 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Missing Keywords ({result.keywordAnalysis.missing.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.missing.map((keyword, index) => (
                      <span key={index} className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            {result.actionItems.length > 0 && (
              <div className="bg-[#2a1f3d] rounded-3xl p-6 shadow-2xl border border-purple-900/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Priority Action Items</h3>
                </div>
                <ol className="space-y-3">
                  {result.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 bg-[#1f1630]/50 rounded-xl p-4 border border-purple-800/30 hover:border-purple-600/50 transition-all">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 pt-1">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Flag className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-400">Red Flags - Immediate Attention Needed</h3>
                </div>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-300 bg-red-950/30 rounded-lg p-3 border border-red-900/30">
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reset Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={resetForm}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Another Resume
              </button>
            </div>
            <div className="flex justify-center pt-6">
              <button
                
              >
                
               Report any problem at ritesh20047@gmail.com
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}