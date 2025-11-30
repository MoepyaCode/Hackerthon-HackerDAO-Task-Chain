// GitHub API Response Types

export interface GitHubOrganization {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  description: string | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  htmlUrl: string;
  defaultBranch: string;
  language: string | null;
  stargazersCount?: number;
  forksCount?: number;
  openIssuesCount?: number;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string | null;
  createdAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string | null;
  createdAt: string;
  closedAt: string | null;
  labels?: string[];
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string | null;
  authorLogin: string | null;
  date: string | null;
  additions?: number;
  deletions?: number;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatarUrl: string;
  contributions: number;
  type: string;
}

export interface RepositoryContributions {
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  commits: GitHubCommit[];
}

export interface ContributionStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalAdditions: number;
  totalDeletions: number;
}
