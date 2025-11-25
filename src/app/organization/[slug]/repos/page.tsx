import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout';
import { getUserGitHubOrganizations } from '@/services/github-org.service';
import { getOrganizationRepositories } from '@/services/github-repo.service';
import { GitHubOrgCard } from '@/components/organization/github-org-card';
import { RepoSelector } from '@/components/organization/repo-selector';
import { hasGitHubConnected } from '@/lib/github';
import { GitHubOrganization, GitHubRepository } from '@/@types/github';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReposPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReposPage({ params }: ReposPageProps) {
  const { userId, orgId } = await auth();
  const { slug } = await params;

  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  // Check if GitHub is connected
  const githubConnected = await hasGitHubConnected();

  if (!githubConnected) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
            Connect GitHub Account
          </h1>
          <p className="text-slate-400 mb-6">
            Please connect your GitHub account to access repositories.
          </p>
          <Link href="/dashboard">
            <Button className="bg-sky-500 hover:bg-sky-600">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  let githubOrgs: GitHubOrganization[] = [];
  let selectedOrgRepos: GitHubRepository[] | undefined;
  let selectedGitHubOrg: GitHubOrganization | undefined;

  try {
    // Fetch GitHub organizations
    githubOrgs = await getUserGitHubOrganizations();
    
    // Try to find matching GitHub org by comparing slugs/names
    // In production, this should be stored in a database mapping
    const client = await clerkClient();
    const clerkOrg = await client.organizations.getOrganization({ organizationId: orgId });
    
    // Try to match by name or use the first org as fallback
    selectedGitHubOrg = githubOrgs.find(org => 
      org.login.toLowerCase() === clerkOrg.slug?.toLowerCase() ||
      org.login.toLowerCase() === clerkOrg.name.toLowerCase().replace(/\s+/g, '-')
    ) || githubOrgs[0];
    
    if (selectedGitHubOrg) {
      selectedOrgRepos = await getOrganizationRepositories(selectedGitHubOrg.login);
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }

  return (
    <>
      <Breadcrumbs />
      <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
            Select Repositories to Track
          </h1>
          <p className="text-slate-400">
            Choose which repositories you want to track for contributions and leaderboard rankings.
          </p>
        </div>

        {!githubOrgs || githubOrgs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-sky-500/20 rounded-lg">
            <p className="text-slate-400 mb-4">No GitHub organizations found.</p>
            <p className="text-sm text-slate-500">
              Make sure your GitHub account has access to organizations.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show available GitHub organizations */}
            {githubOrgs.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-100">
                  Available GitHub Organizations
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  {githubOrgs.map((org) => (
                    <Card 
                      key={org.id}
                      className={`p-4 transition-all ${
                        selectedGitHubOrg?.id === org.id
                          ? 'bg-sky-500/10 border-sky-500/50'
                          : 'bg-slate-900/50 border-sky-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                          <img src={org.avatarUrl} alt={org.login} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-100 truncate">{org.login}</h3>
                          {selectedGitHubOrg?.id === org.id && (
                            <Badge className="mt-1 text-xs bg-sky-500/20 text-sky-400 border-sky-500/30">
                              Currently Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Show repositories for selected organization */}
            {selectedOrgRepos && selectedOrgRepos.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-100">
                  Repositories in {selectedGitHubOrg?.login}
                </h2>
                <RepoSelector repos={selectedOrgRepos} />
              </div>
            ) : selectedGitHubOrg ? (
              <div className="text-center py-12 bg-slate-900/50 border border-sky-500/20 rounded-lg">
                <p className="text-slate-400 mb-4">No repositories found for {selectedGitHubOrg.login}.</p>
                <p className="text-sm text-slate-500">
                  Check your GitHub access permissions or select a different organization.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/50 border border-sky-500/20 rounded-lg">
                <p className="text-slate-400 mb-4">Please select a GitHub organization above.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
