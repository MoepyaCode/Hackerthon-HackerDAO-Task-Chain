import type { Contribution, ContributionStats, ContributionHistory } from '@/@types';

// Mock API service - replace with actual API calls later
export class ContributionService {
  static async getUserContributions(
    userId: string,
    limit?: number
  ): Promise<Contribution[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async getContributionStats(userId: string): Promise<ContributionStats> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async getContributionHistory(
    userId: string,
    days: number = 30
  ): Promise<ContributionHistory[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async syncGitHubData(organizationId: string): Promise<void> {
    // TODO: Implement actual API call to trigger sync
    throw new Error('Not implemented');
  }
}
