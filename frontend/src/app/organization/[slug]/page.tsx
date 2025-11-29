import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout';
import { getUserGitHubOrganizations } from '@/services/github-org.service';
import { getOrganizationRepositories } from '@/services/github-repo.service';
import { hasGitHubConnected } from '@/lib/github';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface OrganizationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { userId, orgId } = await auth();
  const { slug } = await params;

  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  // Fetch organization data
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  const { data: memberships } = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Fetch GitHub data if connected
  let githubOrgs;
  let selectedGitHubOrg;
  let repoCount = 0;
  const githubConnected = await hasGitHubConnected();

  if (githubConnected) {
    try {
      githubOrgs = await getUserGitHubOrganizations();
      
      // Try to match GitHub org with Clerk org
      selectedGitHubOrg = githubOrgs.find(org => 
        org.login.toLowerCase() === organization.slug?.toLowerCase() ||
        org.login.toLowerCase() === organization.name.toLowerCase().replace(/\s+/g, '-')
      ) || githubOrgs[0];

      if (selectedGitHubOrg) {
        const repos = await getOrganizationRepositories(selectedGitHubOrg.login);
        repoCount = repos.length;
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  }

  return (
    <>
      <Breadcrumbs />
      <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
            Organization Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your organization, track repositories, and view team performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="p-6 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-sky-400">Repositories</h3>
            <p className="text-sm text-slate-400 mb-4">
              Select and track GitHub repositories
            </p>
            <Link href={`/organization/${slug}/repos`}>
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                Manage Repos
              </Button>
            </Link>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-sky-400">Members</h3>
            <p className="text-sm text-slate-400 mb-4">
              View and manage team members
            </p>
            <Link href={`/organization/${slug}/members`}>
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                View Members
              </Button>
            </Link>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all">
            <h3 className="text-lg font-semibold mb-2 text-sky-400">Settings</h3>
            <p className="text-sm text-slate-400 mb-4">
              Configure GitHub integration
            </p>
            <Link href={`/organization/${slug}/settings`}>
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                Settings
              </Button>
            </Link>
          </Card>
        </div>

        {/* Organization Info */}
        <Card className="p-6 bg-slate-900/50 border-sky-500/20 mb-8">
          <div className="flex items-start gap-6">
            {organization.imageUrl && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                <Image
                  src={organization.imageUrl}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{organization.name}</h2>
              <p className="text-slate-400 mb-3">
                Created {new Date(organization.createdAt).toLocaleDateString()}
              </p>
              {selectedGitHubOrg && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                    Connected: {selectedGitHubOrg.login}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6 bg-slate-900/50 border-sky-500/20 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100">Quick Stats</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-sky-500/10">
              <p className="text-3xl font-bold text-sky-400 mb-2">{repoCount}</p>
              <p className="text-sm text-slate-400">Available Repos</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-sky-500/10">
              <p className="text-3xl font-bold text-sky-400 mb-2">{memberships.length}</p>
              <p className="text-sm text-slate-400">Team Members</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-sky-500/10">
              <p className="text-3xl font-bold text-sky-400 mb-2">0</p>
              <p className="text-sm text-slate-400">Tracked Repos</p>
              <p className="text-xs text-slate-500 mt-1">Coming Soon</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-sky-500/10">
              <p className="text-3xl font-bold text-sky-400 mb-2">0</p>
              <p className="text-sm text-slate-400">Total Points</p>
              <p className="text-xs text-slate-500 mt-1">Coming Soon</p>
            </div>
          </div>
        </Card>

        {/* GitHub Connection Status */}
        {!githubConnected && (
          <Card className="p-6 bg-yellow-500/10 border-yellow-500/30 mb-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">GitHub Not Connected</h3>
                <p className="text-yellow-200/80 text-sm mb-3">
                  Connect your GitHub account to track repositories and contributions.
                </p>
                <Link href="/dashboard">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Connect GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
    </>
  );
}
