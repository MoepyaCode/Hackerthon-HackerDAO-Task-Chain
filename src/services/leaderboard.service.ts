import type { LeaderboardEntry, LeaderboardFilters, LeaderboardStats } from '@/@types';

interface LeaderboardData {
  stats: LeaderboardStats;
  leaderboardData: LeaderboardEntry[];
}

// Mock API service - loads from JSON until backend is ready
export class LeaderboardService {
  static async getLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardEntry[]> {
    // TODO: Replace with actual API call to backend
    const response = await fetch('/data/leaderboard.json');
    const data: LeaderboardData = await response.json();
    return data.leaderboardData;
  }

  static async getLeaderboardStats(filters: LeaderboardFilters): Promise<LeaderboardStats> {
    // TODO: Replace with actual API call to backend
    const response = await fetch('/data/leaderboard.json');
    const data: LeaderboardData = await response.json();
    return data.stats;
  }

  static async getUserRank(userId: string, filters: LeaderboardFilters): Promise<number> {
    // TODO: Replace with actual API call to backend
    const leaderboard = await this.getLeaderboard(filters);
    const entry = leaderboard.find(e => e.userId === userId);
    return entry?.rank || 0;
  }
}
