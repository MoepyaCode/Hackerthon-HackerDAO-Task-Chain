import type { UserBadge, Badge } from '@/@types';

// Mock API service - replace with actual API calls later
export class BadgeService {
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async getAllBadges(): Promise<Badge[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async mintBadge(userBadgeId: string): Promise<UserBadge> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async checkEligibleBadges(userId: string): Promise<Badge[]> {
    // TODO: Implement actual API call
    return [];
  }
}
