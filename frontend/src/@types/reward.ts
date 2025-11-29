export interface Reward {
  id: string;
  userId: string;
  organizationId: string;
  amount: string;
  currency: string;
  txHash: string | null;
  status: RewardStatus;
  period: string; // e.g., "2024-W47" for week 47
  createdAt: Date;
  processedAt: Date | null;
}

export enum RewardStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface RewardPool {
  id: string;
  organizationId: string;
  totalAmount: string;
  currency: string;
  period: string;
  distributedAmount: string;
  status: RewardPoolStatus;
  createdAt: Date;
}

export enum RewardPoolStatus {
  ACTIVE = 'ACTIVE',
  DISTRIBUTING = 'DISTRIBUTING',
  COMPLETED = 'COMPLETED',
}

export interface RewardTransaction {
  id: string;
  rewardId: string;
  txHash: string;
  status: TransactionStatus;
  errorMessage: string | null;
  createdAt: Date;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}
