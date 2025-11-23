import type { Reward, RewardPool, RewardTransaction } from '@/@types';

// Mock API service - replace with actual API calls later
export class RewardService {
  static async getUserRewards(userId: string): Promise<Reward[]> {
    // TODO: Implement actual API call
    return [];
  }

  static async claimReward(rewardId: string): Promise<RewardTransaction> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async getRewardPool(organizationId: string, period: string): Promise<RewardPool> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async getRewardTransactions(userId: string): Promise<RewardTransaction[]> {
    // TODO: Implement actual API call
    return [];
  }
}
