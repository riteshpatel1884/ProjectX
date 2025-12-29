// types/index.ts

export type TechRole = 'all' | 'web-dev' | 'data-science' | 'ml' | 'sde' | 'other';

export interface User {
  id: string;
  clerkId: string;
  fullName: string;
  phone: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  totalPoints: number;
  rank: string;
  isSubscribed: boolean;
}

export interface LeaderboardUser extends User {
  position: number;
  rankChange: number; // positive for improvement, negative for decline
  techRole?: TechRole;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  currentUser?: LeaderboardUser;
  usersAhead: number;
  usersBehind: number;
}

export interface PointsBreakdown {
  referralPoints: number;
  activityPoints: number;
  projectPoints: number;
  coursePoints: number;
  certificationPoints: number;
  total: number;
}