export interface Contribution {
  id: string;
  userId: string;
  organizationId: string;
  repositoryId: string;
  type: ContributionType;
  points: number;
  metadata: ContributionMetadata;
  createdAt: Date;
}

export interface ContributionMetadata {
  githubId?: string | number;
  title?: string;
  url?: string;
  sha?: string;
  state?: string;
  merged?: boolean;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  [key: string]: string | number | boolean | undefined;
}

export enum ContributionType {
  ISSUE_CLOSED = 'ISSUE_CLOSED',
  PR_OPENED = 'PR_OPENED',
  PR_MERGED = 'PR_MERGED',
  COMMIT_PUSHED = 'COMMIT_PUSHED',
}

export interface ContributionStats {
  totalContributions: number;
  issuesClosed: number;
  prsOpened: number;
  prsMerged: number;
  commitsPushed: number;
  totalPoints: number;
}

export interface ContributionHistory {
  date: string;
  contributions: number;
  points: number;
}
