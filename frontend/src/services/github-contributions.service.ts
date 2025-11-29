import { createGitHubClient } from '@/lib/github-client';
import {
  RepositoryContributions,
  ContributionStats,
} from '@/@types/github';

export async function getRepositoryContributions(
  owner: string,
  repo: string,
  since?: Date
): Promise<RepositoryContributions> {
  const octokit = await createGitHubClient();
  const sinceDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  try {
    // Fetch Pull Requests
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
    });

    // Fetch Issues (excluding PRs)
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      since: sinceDate.toISOString(),
      per_page: 100,
    });

    // Fetch Commits
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      since: sinceDate.toISOString(),
      per_page: 100,
    });

    return {
      pullRequests: pullRequests.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state as 'open' | 'closed',
        author: pr.user?.login || null,
        createdAt: pr.created_at,
        mergedAt: pr.merged_at || null,
        closedAt: pr.closed_at || null,
      })),
      issues: issues
        .filter(issue => !issue.pull_request) // Exclude PRs from issues
        .map(issue => ({
          id: issue.id,
          number: issue.number,
          title: issue.title,
          state: issue.state as 'open' | 'closed',
          author: issue.user?.login || null,
          createdAt: issue.created_at,
          closedAt: issue.closed_at || null,
          labels: issue.labels.map(label => 
            typeof label === 'string' ? label : label.name || ''
          ),
        })),
      commits: commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || null,
        authorLogin: commit.author?.login || null,
        date: commit.commit.author?.date || null,
      })),
    };
  } catch (error) {
    console.error('Error fetching contributions:', error);
    throw new Error('Failed to fetch contributions');
  }
}

export async function getUserContributionStats(
  owner: string,
  repo: string,
  username: string,
  since?: Date
): Promise<ContributionStats> {
  try {
    const contributions = await getRepositoryContributions(owner, repo, since);

    const userPRs = contributions.pullRequests.filter(
      pr => pr.author === username
    );
    const userIssues = contributions.issues.filter(
      issue => issue.author === username
    );
    const userCommits = contributions.commits.filter(
      commit => commit.authorLogin === username
    );

    return {
      totalCommits: userCommits.length,
      totalPRs: userPRs.length,
      totalIssues: userIssues.length,
      totalAdditions: 0, // Would need additional API calls to get this
      totalDeletions: 0, // Would need additional API calls to get this
    };
  } catch (error) {
    console.error('Error fetching user contribution stats:', error);
    throw new Error('Failed to fetch user contribution stats');
  }
}

export async function getPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number
) {
  try {
    const octokit = await createGitHubClient();
    
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login || null,
      createdAt: pr.created_at,
      mergedAt: pr.merged_at || null,
      closedAt: pr.closed_at || null,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files,
      body: pr.body,
    };
  } catch (error) {
    console.error('Error fetching pull request details:', error);
    throw new Error('Failed to fetch pull request details');
  }
}
