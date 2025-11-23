export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  milestone: BadgeMilestone;
  nftTokenId: string | null;
  nftContractAddress: string | null;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: Date;
  txHash: string | null;
  isMinted: boolean;
}

export enum BadgeMilestone {
  FIRST_CONTRIBUTION = 'FIRST_CONTRIBUTION',
  ISSUES_10 = 'ISSUES_10',
  ISSUES_50 = 'ISSUES_50',
  ISSUES_100 = 'ISSUES_100',
  PRS_10 = 'PRS_10',
  PRS_50 = 'PRS_50',
  PRS_100 = 'PRS_100',
  COMMITS_100 = 'COMMITS_100',
  COMMITS_500 = 'COMMITS_500',
  COMMITS_1000 = 'COMMITS_1000',
  POINTS_100 = 'POINTS_100',
  POINTS_500 = 'POINTS_500',
  POINTS_1000 = 'POINTS_1000',
  TOP_CONTRIBUTOR = 'TOP_CONTRIBUTOR',
}

export interface BadgeRequirement {
  milestone: BadgeMilestone;
  requirement: {
    type: 'contributions' | 'points' | 'rank';
    value: number;
    contributionType?: string;
  };
}
