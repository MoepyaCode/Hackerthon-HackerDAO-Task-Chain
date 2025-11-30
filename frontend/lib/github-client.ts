import { Octokit } from '@octokit/rest';
import { getGitHubToken } from './github';

export async function createGitHubClient(): Promise<Octokit> {
  const token = await getGitHubToken();
  
  return new Octokit({
    auth: token,
    userAgent: 'TaskChain/1.0.0',
  });
}

export async function createGitHubClientWithToken(token: string): Promise<Octokit> {
  return new Octokit({
    auth: token,
    userAgent: 'TaskChain/1.0.0',
  });
}
