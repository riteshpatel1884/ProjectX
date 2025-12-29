"use client";
import React, { useState, useEffect } from 'react';
import { GraduationCap, ClipboardCheck, BookOpen, TrendingUp, Menu, X, ArrowRight, CheckCircle, Users, Award, Sparkles, Zap, Target, Calendar, AlertTriangle, CheckCircle2, XCircle, FileText, Brain, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CampusMateHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentMetric, setCurrentMetric] = useState(0);

  const resumeMetrics = [
    { label: 'ATS Score', value: 87, status: 'excellent', color: 'from-emerald-500 to-green-500' },
    { label: 'Keyword Match', value: 92, status: 'excellent', color: 'from-blue-500 to-cyan-500' },
    { label: 'Format Quality', value: 78, status: 'good', color: 'from-purple-500 to-pink-500' },
    { label: 'Impact Score', value: 85, status: 'excellent', color: 'from-orange-500 to-red-500' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const metricInterval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % resumeMetrics.length);
    }, 2500);
    return () => clearInterval(metricInterval);
  }, []);

  const features = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "AI Attendance Predictor",
      description: "Smart algorithms predict your semester attendance and alert you before it's too late",
      href: "/attendance-tracker",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Placement AI Coach",
      description: "Personalized prep roadmaps powered by ML analyzing top company patterns",
      href: "/placement",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Intelligent Notes Library",
      description: "AI-curated study materials ranked by peer reviews and exam relevance",
      href: "/",
    },
  ];

  const WaitlistBadgeAlt = () => {
    return (
      <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-xl ">
        <div className="relative">
          <div className="flex -space-x-3">
            {[
              { letter: 'SS', bg: 'bg-blue-500' },
              { letter: 'BK', bg: 'bg-purple-500' },
              { letter: 'RY', bg: 'bg-indigo-500' }
            ].map((avatar, i) => (
              <div 
                key={i} 
                className={`w-11 h-11 rounded-full ${avatar.bg} border-3 border-white flex items-center justify-center text-sm font-semibold text-white shadow-lg`}
              >
                {avatar.letter}
              </div>
            ))}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white">
            7
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">7 on waitlist</span>
            <span className="px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
              Active
            </span>
          </div>
          <p className="text-sm text-slate-400">Join the waitlist for early access</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Hero Section with Resume Analyzer Demo */}
      <section className="relative pb-12 px-6 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-[1.1]">
                Meet your new
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                Placement partner
              </h1>
              
              <p className="text-lg text-gray-400 mb-6 leading-relaxed max-w-xl">
               Analyze your resume, beat ATS filters, and prepare smarter for campus placements with AI built specifically for students and freshers.
              </p>

              {/* <WaitlistBadgeAlt /> */}
            </div>

            {/* Right - Live Resume Analyzer Demo */}
            <div className="relative "  style={{ transform: 'perspective(1000px) rotateY(-11deg)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl" />
              
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <h3 className="text-base font-semibold">AI Resume Analyzer</h3>
                    </div>
                    <p className="text-xs text-gray-400">Real-time AI analysis</p>
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-400 text-xs font-semibold">ANALYZING</span>
                  </div>
                </div>

                {/* Resume Preview Card */}
                <div className="mb-4 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">my_resume.pdf</div>
                      <div className="text-xs text-gray-400">Uploaded 2 mins ago</div>
                    </div>
                  </div>
                  
                  {/* Analysis Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Analysis Progress</span>
                      <span className="text-xs font-semibold text-blue-400">{analysisProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{width: `${analysisProgress}%`}}
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {resumeMetrics.map((metric, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border transition-all ${
                        idx === currentMetric 
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30' 
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
                      <div className="flex items-end justify-between">
                        <span className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                          {metric.value}
                        </span>
                        <div className="flex items-center gap-1">
                          {metric.value >= 85 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : metric.value >= 75 ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                        <div 
                          className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-500`}
                          style={{width: `${metric.value}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendations */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    AI Recommendations
                  </div>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                    {[
                      { text: 'Add quantified achievements to work experience', priority: 'high' },
                      { text: 'Include 3 more technical skills relevant to role', priority: 'medium' },
                      { text: 'Optimize section headings for ATS compatibility', priority: 'low' },
                    ].map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-white/[0.02] rounded-lg border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          rec.priority === 'high' ? 'bg-red-400' : 
                          rec.priority === 'medium' ? 'bg-yellow-400' : 
                          'bg-blue-400'
                        }`} />
                        <span className="text-xs text-gray-300 leading-relaxed">{rec.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg mt-0.5">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-xs mb-1">AI Insight</div>
                      <div className="text-xs text-gray-400 leading-relaxed">
                        Your resume is 87% optimized for software engineering roles. Add 2-3 more project descriptions to reach 95% match rate.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Scrollbar Styles */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(139, 92, 246, 0.5);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(139, 92, 246, 0.7);
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Resume Analyzer Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Resume Analyzer</span> stands out
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built specifically for college students and freshers targeting campus placements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Campus-Specific AI",
                description: "Trained on 10,000+ successful campus placement resumes to understand what actually works",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Company ATS Match",
                description: "Real-time compatibility check with ATS systems used by top companies hiring from campuses",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Feedback",
                description: "Get actionable suggestions in seconds, not days. Fix issues before applying",
                gradient: "from-orange-500 to-red-500"
              },
             
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity`} />
                <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all h-full">
                  <div className={`p-3 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-xl w-fit mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      {/* <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Intelligence meets
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> simplicity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group relative block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all h-full cursor-pointer">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to transform your college experience?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join 5000+ students using AI to stay ahead in academics and placements
              </p>
              <button className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto w-fit">
                  <Link href="/attendance-tracker">
                    Join the waitlist now
                  </Link>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section> */}
      {/* Upcoming Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Coming Soon</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What's <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">next</span> for You
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're constantly innovating to bring you the most powerful AI tools for placement success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* Feature 6 - Coding Challenge Mentor */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-pink-500/30 transition-all h-full">
                <div className="absolute top-4 right-4 px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded-lg">
                  <span className="text-pink-400 text-xs font-semibold">Expected by Q1 2026</span>
                </div>

                <div className="p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl w-fit mb-4">
                  <Zap className="w-6 h-6 text-pink-400" />
                </div>

                <h3 className="text-xl font-bold mb-2">Coding Challenge Mentor</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  AI mentor that explains DSA concepts, debugs your code, and provides optimal solutions with explanations
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Progress</span>
                    <span className="text-pink-400 font-semibold">55%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{width: '55%'}} />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    <span>Step-by-step explanations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    <span>Multiple solution approaches</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    <span>Complexity analysis</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Feature 2 - Smart Study Groups */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-purple-500/30 transition-all h-full">
                <div className="absolute top-4 right-4 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <span className="text-purple-400 text-xs font-semibold">Expected by Q2 2026</span>
                </div>

                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl w-fit mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>

                <h3 className="text-xl font-bold mb-2">Smart Study Groups</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  AI matches you with peers based on learning style, subjects, and goals for collaborative success
                </p>

                {/* <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Progress</span>
                    <span className="text-purple-400 font-semibold">40%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: '40%'}} />
                  </div>
                </div> */}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-purple-400" />
                    <span>AI-powered peer matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-purple-400" />
                    <span>Collaborative note-taking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-purple-400" />
                    <span>Group study session scheduler</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Career Path Predictor */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-orange-500/30 transition-all h-full">
                <div className="absolute top-4 right-4 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <span className="text-orange-400 text-xs font-semibold">Expected by Q1 2026</span>
                </div>

                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>

                <h3 className="text-xl font-bold mb-2">Career Path Predictor</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  AI model analyzes your skills, interests, and market trends to suggest optimal career trajectories
                </p>

                {/* <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Progress</span>
                    <span className="text-orange-400 font-semibold">55%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{width: '55%'}} />
                  </div>
                </div> */}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-orange-400" />
                    <span>Personalized roadmaps</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-orange-400" />
                    <span>Skill gap analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-orange-400" />
                    <span>Industry trend insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Exam Prep Assistant */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-emerald-500/30 transition-all h-full">
                <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <span className="text-emerald-400 text-xs font-semibold">Expected by Q2 2026</span>
                </div>

                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                </div>

                <h3 className="text-xl font-bold mb-2">AI Placement Prep Assistant</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Adaptive quiz generation and personalized study plans based on your weak areas and exam patterns
                </p>

                {/* <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Progress</span>
                    <span className="text-emerald-400 font-semibold">75%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{width: '75%'}} />
                  </div>
                </div> */}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Previous year paper analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Adaptive practice tests</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Performance tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5 - LinkedIn Profile Optimizer */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-blue-500/30 transition-all h-full">
                <div className="absolute top-4 right-4 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-xs font-semibold">Expected by Q2 2026</span>
                </div>

                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl w-fit mb-4">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold mb-2">LinkedIn Profile Optimizer</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  AI-powered suggestions to make your LinkedIn profile 10x more attractive to campus recruiters
                </p>

                {/* <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Development Progress</span>
                    <span className="text-blue-400 font-semibold">30%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{width: '30%'}} />
                  </div>
                </div> */}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                    <span>Headline optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                    <span>Keyword suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                    <span>Content ideas generator</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>

          {/* Want to Suggest Feature CTA */}
          <div className="mt-12 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30" />
              <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/20">
                <p className="text-lg mb-3">Have a feature idea?</p>
                <button className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2 mx-auto">
                  Suggest a Feature at ritesh20047@gmail.com
                  {/* <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}