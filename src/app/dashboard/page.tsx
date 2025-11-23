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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFire, faRocket, faAward, faBullseye } from '@fortawesome/free-solid-svg-icons';

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
      imageUrl: faBullseye,
      earnedAt: '2024-11-01',
    },
    {
      id: '2',
      name: '10 PRs Merged',
      imageUrl: faRocket,
      earnedAt: '2024-11-10',
    },
    {
      id: '3',
      name: '100 Points',
      imageUrl: faFire,
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
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Track your contributions and performance
          </p>
        </div>

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
