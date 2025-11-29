import type { Reward, RewardPool, RewardTransaction } from '@/@types';

interface WalletData {
  walletData: {
    address: string;
    balance: string;
    totalEarned: string;
    pendingRewards: string;
  };
  transactions: any[];
  badges: any[];
}

// Mock API service - loads from JSON until backend is ready
export class RewardService {
  static async getUserRewards(userId: string): Promise<Reward[]> {
    // TODO: Replace with actual API call to backend
    return [];
  }

  static async claimReward(rewardId: string): Promise<RewardTransaction> {
    // TODO: Replace with actual API call to backend
    throw new Error('Not implemented');
  }

  static async getRewardPool(organizationId: string, period: string): Promise<RewardPool> {
    // TODO: Replace with actual API call to backend
    throw new Error('Not implemented');
  }

  static async getRewardTransactions(userId: string): Promise<RewardTransaction[]> {
    // TODO: Replace with actual API call to backend
    const response = await fetch('/data/wallet.json');
    const data: WalletData = await response.json();
    return data.transactions as RewardTransaction[];
  }

  static async getWalletData(userId: string) {
    // TODO: Replace with actual API call to backend
    const response = await fetch('/data/wallet.json');
    return await response.json();
  }
}
