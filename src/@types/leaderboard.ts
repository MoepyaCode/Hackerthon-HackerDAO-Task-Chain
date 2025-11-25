export interface LeaderboardEntry {
  rank: number;
  userId: string;
  githubUsername: string;
  avatarUrl: string | null;
  totalPoints: number;
  issuesClosed: number;
  prsOpened: number;
  prsMerged: number;
  commitsPushed: number;
  change: number; // Change in rank since last period
}

export interface LeaderboardFilters {
  period?: LeaderboardPeriod;
  organizationId?: string;
  repositoryId?: string;
}

export enum LeaderboardPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ALL_TIME = 'ALL_TIME',
}

export interface LeaderboardStats {
  totalContributors: number;
  totalPoints: number;
  totalContributions: number;
  period: LeaderboardPeriod;
}
