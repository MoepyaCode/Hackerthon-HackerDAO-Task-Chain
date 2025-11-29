import { createGitHubClient } from '@/lib/github-client';
import { GitHubContributor } from '@/@types/github';

export async function getRepositoryContributors(
  owner: string,
  repo: string
): Promise<GitHubContributor[]> {
  try {
    const octokit = await createGitHubClient();
    
    const { data: contributors } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    });

    return contributors.map(contributor => ({
      login: contributor.login || '',
      id: contributor.id || 0,
      avatarUrl: contributor.avatar_url || '',
      contributions: contributor.contributions || 0,
      type: contributor.type || 'User',
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw new Error('Failed to fetch contributors');
  }
}

export async function getContributorActivity(
  owner: string,
  repo: string,
  username: string
) {
  try {
    const octokit = await createGitHubClient();
    
    // Get user's commits
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      author: username,
      per_page: 100,
    });

    // Get user's pull requests
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100,
    });

    const userPRs = pullRequests.filter(pr => pr.user?.login === username);

    // Get user's issues
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      creator: username,
      state: 'all',
      per_page: 100,
    });

    const userIssues = issues.filter(issue => !issue.pull_request);

    return {
      commits: commits.length,
      pullRequests: userPRs.length,
      mergedPRs: userPRs.filter(pr => pr.merged_at).length,
      issues: userIssues.length,
      closedIssues: userIssues.filter(issue => issue.state === 'closed').length,
    };
  } catch (error) {
    console.error('Error fetching contributor activity:', error);
    throw new Error('Failed to fetch contributor activity');
  }
}
