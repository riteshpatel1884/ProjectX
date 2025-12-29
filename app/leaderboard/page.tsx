"use client"
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, HelpCircle, ChevronLeft, ChevronRight, Sparkles, Trophy, Users, Target, Zap, Brain, Info, Star, TrendingUp, Shield, Code, Database, Layers, Briefcase, Pin, Calendar, CheckCircle } from 'lucide-react';

type ExperienceLevel = 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR';

type User = {
  id: string;
  clerkId: string;
  fullName: string;
  email: string;
  totalPoints: number;
  experience?: ExperienceLevel;
  roles: { role: string }[];
  skills: { skill: string; points: number }[];
  dailyTaskPoints: number;
  completedDailyTasks: number;
  previousRank?: number;
  currentRank?: number;
  rankChange?: number;
};

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [selectedExperience, setSelectedExperience] = useState('ALL');
  const [sortByDailyTasks, setSortByDailyTasks] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error:', errorText);
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      const usersList = Array.isArray(data) ? data : (data.users || []);
      const currentUser = data.currentUserId || '';
      
      if (!Array.isArray(usersList)) {
        setUsers([]);
        setFilteredUsers([]);
        return;
      }
      
      const usersWithRanks = usersList.map((user: User, index: number) => ({
        ...user,
        currentRank: index + 1,
        rankChange: 0 
      }));
      
      setUsers(usersWithRanks);
      setFilteredUsers(usersWithRanks);
      
      if (currentUser) {
        setCurrentUserId(currentUser);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...users];
    
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => 
        user.roles.some(r => r.role === selectedRole)
      );
    }

    if (selectedExperience !== 'ALL') {
      filtered = filtered.filter(user => user.experience === selectedExperience);
    }
    
    if (selectedSkill !== 'ALL') {
      filtered = filtered.filter(user => 
        user.skills.some(s => s.skill === selectedSkill && s.points > 0)
      );
      filtered.sort((a, b) => {
        const aSkill = a.skills.find(s => s.skill === selectedSkill)?.points || 0;
        const bSkill = b.skills.find(s => s.skill === selectedSkill)?.points || 0;
        return bSkill - aSkill;
      });
    } else if (sortByDailyTasks) {
      // Sort by daily task points
      filtered.sort((a, b) => b.dailyTaskPoints - a.dailyTaskPoints);
    } else {
      filtered.sort((a, b) => b.totalPoints - a.totalPoints);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [selectedRole, selectedSkill, selectedExperience, sortByDailyTasks, users]);

  const currentUserRank = filteredUsers.findIndex(u => u.id === currentUserId) + 1;
  const currentUser = currentUserRank > 0 ? filteredUsers[currentUserRank - 1] : null;
  
  const otherUsers = filteredUsers.filter(u => u.id !== currentUserId);
  
  const totalPages = Math.ceil(otherUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageUsers = otherUsers.slice(startIndex, endIndex);

  const displayUsers = currentUser ? [currentUser, ...currentPageUsers] : currentPageUsers;

  const usersAhead = currentUserRank - 1;
  const usersBehind = filteredUsers.length - currentUserRank;

  const getUserPoints = (user: User) => {
    if (sortByDailyTasks) {
      return user.dailyTaskPoints;
    }
    if (selectedSkill === 'ALL') {
      return user.totalPoints;
    }
    const skillData = user.skills.find(s => s.skill === selectedSkill);
    return skillData?.points || 0;
  };

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSkillName = (skill: string) => {
    return skill.replace(/_/g, ' ').toUpperCase();
  };

  const getExperienceLabel = (exp?: ExperienceLevel) => {
    if (!exp) return 'Not Set';
    
    switch(exp) {
      case 'FRESHER': return 'Fresher';
      case 'JUNIOR': return 'Junior';
      case 'MID': return 'Mid-Level';
      case 'SENIOR': return 'Senior';
      default: return exp;
    }
  };

  const getSkillIcon = (skill: string) => {
    switch(skill.toUpperCase()) {
      case 'DSA': return <Code className="w-4 h-4" />;
      case 'WEB_DEVELOPMENT': return <Layers className="w-4 h-4" />;
      case 'SYSTEM_DESIGN': return <Database className="w-4 h-4" />;
      case 'MACHINE_LEARNING': return <Brain className="w-4 h-4" />;
      case 'DATA_ANALYSIS': return <Database className="w-4 h-4" />;
      case 'STATISTICS': return <TrendingUp className="w-4 h-4" />;
      case 'SQL': return <Database className="w-4 h-4" />;
      case 'PROJECTS': return <Target className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <Trophy className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-purple-200 font-semibold text-lg">Loading Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 pt-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">My Position in the Tech Leaderboard</span>
          </h1>
          
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Discover where you rank among thousands of engineers. Track your progress and compete with the best.
          </p>
        </div>

        {currentUserRank > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-300 font-medium">Your Rank</p>
                  <p className="text-3xl font-bold text-white">#{currentUserRank}</p>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, 100 - (currentUserRank / filteredUsers.length * 100))}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-300 font-medium">Competitors Ahead</p>
                  <p className="text-3xl font-bold text-white">{usersAhead}</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">Keep pushing to reach the top!</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-300 font-medium">Behind You</p>
                  <p className="text-3xl font-bold text-white">{usersBehind}</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">You're ahead of {Math.round((usersBehind / filteredUsers.length) * 100)}% of users</p>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Filter Rankings</h3>
                <p className="text-sm text-purple-300">Narrow down by role, skill, experience, or daily tasks</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center items-center">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border-2 border-white/20 focus:outline-none focus:border-purple-400 font-medium text-sm transition-colors [&>option]:bg-purple-900 [&>option]:text-white"
              >
                <option value="ALL">All Roles</option>
                <option value="SDE">SDE</option>
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
                <option value="FULLSTACK">Full Stack</option>
                <option value="DATA_ANALYST">Data Analyst</option>
                <option value="DATA_SCIENTIST">Data Scientist</option>
                <option value="ML_ENGINEER">ML Engineer</option>
              </select>

              <select
                value={selectedSkill}
                onChange={(e) => {
                  setSelectedSkill(e.target.value);
                  setSortByDailyTasks(false);
                }}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border-2 border-white/20 focus:outline-none focus:border-purple-400 font-medium text-sm transition-colors [&>option]:bg-purple-900 [&>option]:text-white"
              >
                <option value="ALL">All Skills</option>
                <option value="DSA">DSA</option>
                <option value="WEB_DEVELOPMENT">Web Development</option>
                <option value="PROJECTS">Projects</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="MACHINE_LEARNING">Machine Learning</option>
                <option value="DATA_ANALYSIS">Data Analysis</option>
                <option value="STATISTICS">Statistics</option>
                <option value="SQL">SQL</option>
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border-2 border-white/20 focus:outline-none focus:border-purple-400 font-medium text-sm transition-colors [&>option]:bg-purple-900 [&>option]:text-white"
              >
                <option value="ALL">All Experience</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid-Level</option>
                <option value="SENIOR">Senior</option>
              </select>

              <button
                onClick={() => {
                  setSortByDailyTasks(!sortByDailyTasks);
                  setSelectedSkill('ALL');
                }}
                className={`px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all flex items-center gap-2 ${
                  sortByDailyTasks
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400 text-white'
                    : 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:border-orange-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Daily Tasks
              </button>

              <button onClick={() => setShowPointsModal(true)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <HelpCircle className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 backdrop-blur-sm border-b-2 border-white/20">
                  <th className="px-8 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">Engineer</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-purple-300 uppercase tracking-wider">Experience</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {sortByDailyTasks ? 'Daily Task Points' : selectedSkill === 'ALL' ? 'Total Points' : `${formatSkillName(selectedSkill)} Points`}
                  </th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-purple-300 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {displayUsers.map((user, index) => {
                  const isCurrentUser = user.id === currentUserId;
                  const isPinnedUser = index === 0 && isCurrentUser;
                  
                  let displayRank;
                  if (isPinnedUser) {
                    displayRank = currentUserRank;
                  } else {
                    const userPositionInFiltered = filteredUsers.findIndex(u => u.id === user.id) + 1;
                    displayRank = userPositionInFiltered;
                  }
                  
                  const displayPoints = getUserPoints(user);
                  
                  return (
                    <tr 
                      key={user.id}
                      className={`${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-l-4 border-purple-400 shadow-lg' 
                          : 'hover:bg-white/5'
                      } transition-all duration-200 ${isPinnedUser ? 'sticky top-0 z-10 backdrop-blur-md' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {isPinnedUser && (
                            <Pin className="w-5 h-5 text-purple-400 animate-pulse" />
                          )}
                          <span className={`font-bold text-xl ${
                            displayRank <= 3 
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                              : 'text-white'
                          }`}>
                            {displayRank}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            isCurrentUser
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-2 ring-purple-400'
                              : 'bg-white/10 text-white'
                          }`}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold text-base ${
                              isCurrentUser ? 'text-white' : 'text-purple-100'
                            }`}>
                              {user.fullName}
                            </p>
                            {isCurrentUser && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-purple-400/40 text-white text-xs rounded-md font-semibold border border-purple-300">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                          <Briefcase className="w-4 h-4 text-purple-300" />
                          <span className="text-white text-sm font-medium">
                            {getExperienceLabel(user.experience)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-xl border border-purple-400/30">
                          {sortByDailyTasks ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-purple-300" />
                              <span className="text-white font-bold text-lg">{displayPoints}</span>
                              <span className="text-purple-300 text-xs">({user.completedDailyTasks} tasks)</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-purple-300" />
                              <span className="text-white font-bold text-lg">{displayPoints.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setSelectedUserDetails(user)}
                            className="w-10 h-10 bg-white/10 hover:bg-purple-500/30 rounded-lg flex items-center justify-center transition-colors group border border-white/20"
                          >
                            <Info className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white/5 backdrop-blur-sm px-8 py-5 flex items-center justify-between border-t border-white/20">
            <p className="text-sm text-purple-300 font-medium">
              Showing <span className="font-bold text-white">{startIndex + 1}</span> to <span className="font-bold text-white">{Math.min(endIndex, otherUsers.length)}</span> of <span className="font-bold text-white">{otherUsers.length}</span> engineers
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/10 border-2 border-white/20 text-white rounded-lg hover:border-purple-400 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white/10 border-2 border-white/20 text-white hover:border-purple-400 hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/10 border-2 border-white/20 text-white rounded-lg hover:border-purple-400 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group border border-purple-400/30"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>

        {selectedUserDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedUserDetails(null)}>
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-full max-w-md border border-purple-500/30 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl text-white flex-shrink-0">
                    {selectedUserDetails.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{selectedUserDetails.fullName}</h2>
                    <p className="text-purple-300 text-sm">{selectedUserDetails.totalPoints.toLocaleString()} total points</p>
                    <p className="text-orange-300 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {selectedUserDetails.completedDailyTasks} daily tasks ({selectedUserDetails.dailyTaskPoints} pts)
                    </p>
                    <p className="text-purple-400 text-xs mt-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {getExperienceLabel(selectedUserDetails.experience)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUserDetails(null)}
                  className="text-purple-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl flex-shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserDetails.roles.map((roleObj, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-purple-500/20 text-purple-200 text-sm rounded-lg font-semibold border border-purple-400/30 uppercase"
                      >
                        {formatRoleName(roleObj.role)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Skills Breakdown
                  </h4>
                  <div className="space-y-3">
                    {selectedUserDetails.skills
                      .filter(s => s.points > 0)
                      .sort((a, b) => b.points - a.points)
                      .map((skillObj, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-300 border border-purple-400/30 flex-shrink-0">
                                {getSkillIcon(skillObj.skill)}
                              </div>
                              <span className="text-sm font-semibold text-white">
                                {formatSkillName(skillObj.skill)}
                              </span>
                            </div>
                            <span className="text-base md:text-lg font-bold text-purple-300">
                              {skillObj.points}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPointsModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPointsModal(false)}>
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How Rankings Work</h2>
                  <p className="text-purple-300 text-sm md:text-base">Understanding the point system and rankings</p>
                </div>
                <button
                  onClick={() => setShowPointsModal(false)}
                  className="text-purple-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl flex-shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div className="bg-orange-500/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-orange-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Daily Task System</h3>
                  </div>
                  <p className="text-orange-100 text-sm md:text-base mb-3">
                    Complete daily goals to earn 3 points each. Set one task per day and mark it complete when done. Filter the leaderboard by daily task points to see who's most consistent!
                  </p>
                </div>

                <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-purple-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Skill Categories</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-purple-100">
                      <Code className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>DSA:</strong> Problem-solving & algorithms</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <Layers className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>Web Dev:</strong> Frontend & backend projects</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <Database className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>System Design:</strong> Architecture knowledge</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <Brain className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>ML:</strong> AI & machine learning</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <Database className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>Data Analysis:</strong> Data analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-100">
                      <TrendingUp className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span><strong>Statistics:</strong> Statistical analysis</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-emerald-400/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Ranking System</h3>
                  </div>
                  <p className="text-emerald-100 text-sm md:text-base mb-3">
                    Rankings are calculated based on your total points across all skills. Filter by role, skill, experience level, or daily task completion to see how you compare in specific categories.
                  </p>
                  <p className="text-emerald-200 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-400/20">
                    <strong className="flex items-center gap-2"><Pin className="w-4 h-4" /> Your Rank:</strong> Your position is always pinned at the top of the table with a special highlight, regardless of which page you're viewing!
                  </p>
                </div>

                <div className="bg-pink-500/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-pink-400/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Pro Tips</h3>
                  </div>
                  <ul className="space-y-2 text-pink-100 text-sm md:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-300 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Complete daily tasks consistently to climb the daily task leaderboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-300 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Focus on your weakest skills to gain points faster</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-300 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Filter by experience level to compete with peers at your stage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {showChatbot && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowChatbot(false)}>
            <div className="w-full max-w-2xl h-[80vh] md:h-[600px] bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-500/30 flex flex-col overflow-hidden animate-fadeIn" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 md:p-5 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg">AI Career Coach</h3>
                    <p className="text-purple-100 text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Instant guidance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AIChatContent />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const AIChatContent = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI career coach. Ask me how to improve your rank, which skills to focus on, or strategies to climb the leaderboard!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/leaderboard/AIchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessage = data.message || 'Sorry, I encountered an error.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Here are some tips:\n\n• Complete daily tasks consistently for steady progress\n• Focus on DSA for SDE roles\n• Build projects to showcase skills\n• Learn system design for mid-level positions'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-white/10 text-purple-100 border-2 border-white/20 shadow-sm backdrop-blur-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-purple-100 p-4 rounded-2xl border-2 border-white/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t-2 border-white/20 bg-white/5 flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-white/10 text-white placeholder-purple-300 px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-purple-400 transition-colors backdrop-blur-sm"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;