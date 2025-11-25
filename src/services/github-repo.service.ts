import { createGitHubClient } from '@/lib/github-client';
import { GitHubRepository } from '@/@types/github';

export async function getOrganizationRepositories(orgName: string): Promise<GitHubRepository[]> {
  try {
    const octokit = await createGitHubClient();
    
    const { data: repos } = await octokit.rest.repos.listForOrg({
      org: orgName,
      type: 'all',
      per_page: 100,
      sort: 'updated',
    });

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || null,
      private: repo.private,
      htmlUrl: repo.html_url,
      defaultBranch: repo.default_branch || 'main',
      language: repo.language || null,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
    }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories');
  }
}

export async function getUserRepositories(): Promise<GitHubRepository[]> {
  try {
    const octokit = await createGitHubClient();
    
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'updated',
      affiliation: 'owner,collaborator,organization_member',
    });

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || null,
      private: repo.private,
      htmlUrl: repo.html_url,
      defaultBranch: repo.default_branch || 'main',
      language: repo.language || null,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
    }));
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw new Error('Failed to fetch user repositories');
  }
}

export async function getRepositoryDetails(owner: string, repo: string) {
  try {
    const octokit = await createGitHubClient();
    
    const { data } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description || null,
      private: data.private,
      htmlUrl: data.html_url,
      defaultBranch: data.default_branch,
      language: data.language || null,
      stargazersCount: data.stargazers_count,
      forksCount: data.forks_count,
      openIssuesCount: data.open_issues_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
    };
  } catch (error) {
    console.error('Error fetching repository details:', error);
    throw new Error('Failed to fetch repository details');
  }
}
