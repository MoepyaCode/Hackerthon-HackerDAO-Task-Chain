export enum ContributionType {
  ISSUE_CLOSED = 'ISSUE_CLOSED',
  PR_OPENED = 'PR_OPENED',
  PR_MERGED = 'PR_MERGED',
  COMMIT_PUSHED = 'COMMIT_PUSHED',
}

export const CONTRIBUTION_POINTS: Record<ContributionType, number> = {
  [ContributionType.ISSUE_CLOSED]: 10,
  [ContributionType.PR_OPENED]: 5,
  [ContributionType.PR_MERGED]: 15,
  [ContributionType.COMMIT_PUSHED]: 2,
};

export const CONTRIBUTION_LABELS: Record<ContributionType, string> = {
  [ContributionType.ISSUE_CLOSED]: 'Issue Closed',
  [ContributionType.PR_OPENED]: 'PR Opened',
  [ContributionType.PR_MERGED]: 'PR Merged',
  [ContributionType.COMMIT_PUSHED]: 'Commit Pushed',
};
