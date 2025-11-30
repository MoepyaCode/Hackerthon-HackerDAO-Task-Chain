import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header, BottomNav, Breadcrumbs } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Trophy,
  TrendingUp,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  Award,
  Coins,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFire, faRocket, faAward, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { getUserGitHubOrganizations } from '@/services/github-org.service';
import { UserService } from '@/services/user.service';
import { BadgeService } from '@/services/badge.service';
import { LeaderboardService } from '@/services/leaderboard.service';
import { hasGitHubConnected } from '@/lib/github';
import { LeaderboardPeriod } from '@/@types/leaderboard';
import { ConnectableGitHubOrgCard } from '@/components/organization/connectable-github-org-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { clerkClient } from '@clerk/nextjs/server';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface DashboardContribution {
  id: string;
  type: string;
  title: string;
  repo: string;
  points: number;
  date: string;
}

interface DashboardBadge {
  id: string;
  name: string;
  imageUrl: IconDefinition;
  earnedAt: string;
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if GitHub is connected and fetch organizations
  let githubConnected = false;
  let githubOrgs: Awaited<ReturnType<typeof getUserGitHubOrganizations>> = [];

  try {
    githubConnected = await hasGitHubConnected();

    if (githubConnected) {
      try {
        githubOrgs = await getUserGitHubOrganizations();
      } catch (error) {
        console.error('Error fetching GitHub organizations:', error);
        // If token is invalid, treat as not connected
        githubConnected = false;
      }
    }
  } catch (error) {
    console.error('Error checking GitHub connection:', error);
    // Silently fail and show as not connected
    githubConnected = false;
  }

  // Get user's Clerk organizations to check which GitHub orgs are already connected
  const userMemberships = await (await clerkClient()).users.getOrganizationMembershipList({
    userId: userId,
  });

  // Get full organization details for each membership
  const clerkOrgs = await Promise.all(
    userMemberships.data.map(async (membership) => {
      return await (await clerkClient()).organizations.getOrganization({
        organizationId: membership.organization.id,
      });
    })
  );

  // Map GitHub orgs to their connection status
  const githubOrgsWithStatus = githubOrgs.map((githubOrg) => {
    const connectedClerkOrg = clerkOrgs.find(
      (clerkOrg) => clerkOrg.publicMetadata?.githubOrg === githubOrg.login
    );
    return {
      ...githubOrg,
      isConnected: !!connectedClerkOrg,
      clerkOrgSlug: connectedClerkOrg?.slug,
    };
  });

  // Fetch real data
  const userProfile = await UserService.getUserProfile(userId);

  const stats = {
    totalPoints: 0,
    rank: 0,
    issuesClosed: 0,
    prsOpened: 0,
    prsMerged: 0,
    commitsPushed: 0,
  };

  let recentContributions: DashboardContribution[] = [];
  let badges: DashboardBadge[] = [];

  if (userProfile) {
    const contributions = userProfile.contributions;
    stats.totalPoints = contributions.reduce((sum, c) => sum + c.points, 0);
    stats.issuesClosed = contributions.filter(c => c.contributionType === 'issue').length;
    stats.prsOpened = contributions.filter(c => c.contributionType === 'pr').length;
    stats.prsMerged = contributions.filter(c => c.contributionType === 'pr').length; // Assuming logged PRs are merged/valid for now
    stats.commitsPushed = contributions.filter(c => c.contributionType === 'commit').length;

    // Get rank
    stats.rank = await LeaderboardService.getUserRank(userProfile.id, { period: LeaderboardPeriod.ALL_TIME });

    // Map contributions
    recentContributions = contributions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(c => {
        let type = 'COMMIT_PUSHED';
        if (c.contributionType === 'pr') type = 'PR_MERGED';
        else if (c.contributionType === 'issue') type = 'ISSUE_CLOSED';

        // Safe cast for metadata
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadata = c.metadata as any;
        const title = metadata?.title || (c.contributionType === 'commit' ? `Commit: ${c.externalId.substring(0, 7)}` : 'Contribution');

        // Safe cast for repo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const repoName = (c as any).repo?.fullName || 'Unknown Repo';

        // Format date relative
        const date = new Date(c.createdAt);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        let dateStr = '';
        if (diffInHours < 24) dateStr = `${diffInHours} hours ago`;
        else dateStr = `${Math.floor(diffInHours / 24)} days ago`;

        return {
          id: c.id,
          type,
          title,
          repo: repoName,
          points: c.points,
          date: dateStr,
        };
      });

    // Get badges
    const userBadges = await BadgeService.getUserBadges(userProfile.id);

    // Icon mapping
    const iconMap: Record<string, IconDefinition> = {
      '/badges/first-contribution.png': faBullseye,
      '/badges/prs-10.png': faRocket,
    };

    badges = userBadges.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      imageUrl: iconMap[ub.badge.imageUrl] || faAward,
      earnedAt: ub.earnedAt.toISOString().split('T')[0],
    }));
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'PR_MERGED':
        return <GitPullRequest className="h-4 w-4" />;
      case 'ISSUE_CLOSED':
        return <AlertCircle className="h-4 w-4" />;
      case 'COMMIT_PUSHED':
        return <GitCommit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Track your contributions and performance
          </p>
        </div>

        {/* GitHub Connection Status */}
        {!githubConnected && (
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-400 mb-1">Connect GitHub Account</h3>
                  <p className="text-sm text-slate-300">
                    Connect your GitHub account to start tracking contributions and accessing repositories.
                  </p>
                </div>
                <Link href="/sign-in">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Connect GitHub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GitHub Organizations */}
        {githubConnected && githubOrgsWithStatus.length > 0 && (
          <Card className="bg-slate-900/50 border-sky-500/20">
            <CardHeader>
              <CardTitle className="text-slate-100">Your GitHub Organizations</CardTitle>
              <CardDescription className="text-slate-400">
                Connect your GitHub organizations to start tracking contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {githubOrgsWithStatus.map((org) => (
                  <ConnectableGitHubOrgCard
                    key={org.id}
                    org={org}
                    isConnected={org.isConnected}
                    clerkOrgSlug={org.clerkOrgSlug}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-400">{stats.totalPoints}</div>
              <p className="text-xs text-slate-400">
                Rank #{stats.rank} overall
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Issues Closed</CardTitle>
              <AlertCircle className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.issuesClosed}</div>
              <p className="text-xs text-slate-400">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">PRs Merged</CardTitle>
              <GitPullRequest className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.prsMerged}</div>
              <p className="text-xs text-slate-400">
                {stats.prsOpened} opened total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.commitsPushed}</div>
              <p className="text-xs text-slate-400">
                Across all repositories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contributions" className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-sky-500/20">
            <TabsTrigger value="contributions" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Recent Contributions</TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Badges</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="contributions" className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
              <CardHeader>
                <CardTitle className="text-slate-100">Recent Activity</CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest contributions across all repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between border-b border-sky-500/10 pb-4 last:border-0 last:pb-0 hover:bg-sky-500/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-sky-400">{getContributionIcon(contribution.type)}</div>
                        <div>
                          <p className="font-medium text-slate-200">{contribution.title}</p>
                          <p className="text-sm text-slate-400">
                            {contribution.repo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-sky-500/20 text-sky-400 border-sky-500/30">+{contribution.points} pts</Badge>
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {contribution.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
              <CardHeader>
                <CardTitle className="text-slate-100">Your Badges</CardTitle>
                <CardDescription className="text-slate-400">
                  NFT badges earned for milestones and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {badges.map((badge) => (
                    <Card key={badge.id} className="bg-slate-800/50 border-sky-500/20 hover:border-sky-400/50 hover:bg-slate-800/70 transition-all duration-300 group">
                      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                        <div className="text-4xl text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                          <FontAwesomeIcon icon={badge.imageUrl} />
                        </div>
                        <div>
                          <CardTitle className="text-base text-slate-100">{badge.name}</CardTitle>
                          <CardDescription className="text-xs text-slate-400">
                            Earned {badge.earnedAt}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
              <CardHeader>
                <CardTitle className="text-slate-100">Reward History</CardTitle>
                <CardDescription className="text-slate-400">
                  Your crypto payouts and transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-sky-500/10 pb-4 hover:bg-sky-500/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Coins className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="font-medium text-slate-200">Weekly Reward</p>
                        <p className="text-sm text-slate-400">Week 47 - 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-100">50 CELO</p>
                      <p className="text-xs text-emerald-400">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-sky-500/10 pb-4 hover:bg-sky-500/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="font-medium text-slate-200">Weekly Reward</p>
                        <p className="text-sm text-slate-400">Week 46 - 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-100">35 CELO</p>
                      <p className="text-xs text-yellow-400">Processing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
