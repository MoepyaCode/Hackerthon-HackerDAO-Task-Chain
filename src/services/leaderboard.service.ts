import type { LeaderboardEntry, LeaderboardFilters, LeaderboardStats } from '@/@types';

// Mock API service - replace with actual API calls later
export class LeaderboardService {
  static async getLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardEntry[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async getLeaderboardStats(filters: LeaderboardFilters): Promise<LeaderboardStats> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async getUserRank(userId: string, filters: LeaderboardFilters): Promise<number> {
    // TODO: Implement actual API call
    return 0;
  }
}
