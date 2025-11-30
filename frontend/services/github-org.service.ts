import { createGitHubClient } from '@/lib/github-client';
import { GitHubOrganization } from '@/@types/github';

export async function getUserGitHubOrganizations(): Promise<GitHubOrganization[]> {
  try {
    const octokit = await createGitHubClient();
    
    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser({
      per_page: 100,
    });

    return orgs.map(org => ({
      id: org.id,
      login: org.login,
      name: org.login,
      avatarUrl: org.avatar_url,
      description: org.description || null,
    }));
  } catch (error) {
    console.error('Error fetching GitHub organizations:', error);
    throw new Error('Failed to fetch GitHub organizations');
  }
}

export async function getOrganizationDetails(orgName: string) {
  try {
    const octokit = await createGitHubClient();
    
    const { data: org } = await octokit.rest.orgs.get({
      org: orgName,
    });

    return {
      id: org.id,
      login: org.login,
      name: org.name || org.login,
      avatarUrl: org.avatar_url,
      description: org.description || null,
      publicRepos: org.public_repos,
      followers: org.followers,
      following: org.following,
    };
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw new Error('Failed to fetch organization details');
  }
}
