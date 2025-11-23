'use client';

import { Header, BottomNav } from '@/components/layout';
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

export default function DashboardPage() {

  // Mock data - will be replaced with real data from API
  const stats = {
    totalPoints: 1234,
    rank: 3,
    issuesClosed: 45,
    prsOpened: 28,
    prsMerged: 25,
    commitsPushed: 189,
  };

  const recentContributions = [
    {
      id: '1',
      type: 'PR_MERGED',
      title: 'Add user authentication',
      repo: 'taskchain/frontend',
      points: 15,
      date: '2 hours ago',
    },
    {
      id: '2',
      type: 'ISSUE_CLOSED',
      title: 'Fix mobile responsive layout',
      repo: 'taskchain/frontend',
      points: 10,
      date: '5 hours ago',
    },
    {
      id: '3',
      type: 'COMMIT_PUSHED',
      title: 'Update dependencies',
      repo: 'taskchain/backend',
      points: 2,
      date: '1 day ago',
    },
  ];

  const badges = [
    {
      id: '1',
      name: 'First Contribution',
      imageUrl: '🎯',
      earnedAt: '2024-11-01',
    },
    {
      id: '2',
      name: '10 PRs Merged',
      imageUrl: '🚀',
      earnedAt: '2024-11-10',
    },
    {
      id: '3',
      name: '100 Points',
      imageUrl: '💯',
      earnedAt: '2024-11-15',
    },
  ];

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your contributions and performance
          </p>
        </div>

        {/* Stats Grid */}
          <div className="grid gap-3 grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPoints}</div>
                <p className="text-xs text-muted-foreground">
                  Rank #{stats.rank} overall
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Closed</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.issuesClosed}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PRs Merged</CardTitle>
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.prsMerged}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.prsOpened} opened total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commits</CardTitle>
                <GitCommit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.commitsPushed}</div>
                <p className="text-xs text-muted-foreground">
                  Across all repositories
                </p>
              </CardContent>
            </Card>
          </div>

        {/* Tabs */}
        <Tabs defaultValue="contributions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="contributions">Recent Contributions</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="contributions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest contributions across all repositories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getContributionIcon(contribution.type)}</div>
                          <div>
                            <p className="font-medium">{contribution.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {contribution.repo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">+{contribution.points} pts</Badge>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
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
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>
                    NFT badges earned for milestones and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badges.map((badge) => (
                      <Card key={badge.id}>
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                          <div className="text-4xl">{badge.imageUrl}</div>
                          <div>
                            <CardTitle className="text-base">{badge.name}</CardTitle>
                            <CardDescription className="text-xs">
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
              <Card>
                <CardHeader>
                  <CardTitle>Reward History</CardTitle>
                  <CardDescription>
                    Your crypto payouts and transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <Coins className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">Weekly Reward</p>
                          <p className="text-sm text-muted-foreground">Week 47 - 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">50 CELO</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="font-medium">Weekly Reward</p>
                          <p className="text-sm text-muted-foreground">Week 46 - 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">35 CELO</p>
                        <p className="text-xs text-yellow-500">Processing</p>
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
