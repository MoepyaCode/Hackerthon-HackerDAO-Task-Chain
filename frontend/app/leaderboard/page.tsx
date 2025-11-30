'use client';

import { useState, useEffect } from 'react';
import { Header, BottomNav, Breadcrumbs } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy, TrendingUp, TrendingDown, Medal } from 'lucide-react';
// import { LeaderboardService } from '@/services/leaderboard.service'; // Moved to dynamic import

interface LeaderboardEntry {
  rank: number;
  userId: string;
  githubUsername: string;
  avatarUrl?: string | null;
  totalPoints: number;
  issuesClosed: number;
  prsOpened: number;
  prsMerged: number;
  commitsPushed: number;
  change: number;
}

interface LeaderboardStats {
  totalContributors: number;
  totalPoints: number;
  totalContributions: number;
}

interface LeaderboardData {
  stats: LeaderboardStats;
  leaderboardData: LeaderboardEntry[];
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Dynamic import to avoid Prisma client initialization during SSR
        const { LeaderboardService } = await import('@/services/leaderboard.service');

        // Using service layer to load data
        const [leaderboardData, stats] = await Promise.all([
          LeaderboardService.getLeaderboard({}),
          LeaderboardService.getLeaderboardStats({}),
        ]);
        setData({ leaderboardData, stats });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 p-4">
          <p className="text-slate-400">Loading...</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 p-4">
          <p className="text-slate-400">Failed to load leaderboard data</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  const { stats, leaderboardData } = data;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.3)]" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />;
      default:
        return <span className="text-slate-400">#{rank}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-rose-400">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs">{change}</span>
        </div>
      );
    }
    return <span className="text-xs text-slate-500">—</span>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <Breadcrumbs />
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">Leaderboard</h1>
          <p className="text-sm text-slate-400">
            Top contributors and their rankings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-1">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Total Contributors
              </CardTitle>
              <Trophy className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-400">{stats.totalContributors}</div>
              <p className="text-xs text-slate-400">
                Active this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {stats.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                Earned this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Total Contributions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {stats.totalContributions.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="bg-slate-900/50 border border-sky-500/20">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Monthly</TabsTrigger>
            <TabsTrigger value="all-time" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
              <CardHeader>
                <CardTitle className="text-slate-100">Weekly Rankings</CardTitle>
                <CardDescription className="text-slate-400">
                  Top performers for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-sky-500/20 hover:bg-sky-500/5">
                      <TableHead className="w-16 text-slate-300">Rank</TableHead>
                      <TableHead className="text-slate-300">User</TableHead>
                      <TableHead className="text-right text-slate-300">Points</TableHead>
                      <TableHead className="text-right text-slate-300">Issues</TableHead>
                      <TableHead className="text-right text-slate-300">PRs</TableHead>
                      <TableHead className="text-right text-slate-300">Commits</TableHead>
                      <TableHead className="text-right text-slate-300">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry) => (
                      <TableRow key={entry.userId} className="border-sky-500/10 hover:bg-sky-500/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="border border-sky-500/20">
                              <AvatarImage src={entry.avatarUrl || undefined} />
                              <AvatarFallback className="bg-sky-500/10 text-sky-400">
                                {entry.githubUsername.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-200">
                              {entry.githubUsername}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-sky-400">
                          {entry.totalPoints.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {entry.issuesClosed}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {entry.prsMerged}/{entry.prsOpened}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {entry.commitsPushed}
                        </TableCell>
                        <TableCell className="text-right">
                          {getChangeIndicator(entry.change)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Rankings</CardTitle>
                <CardDescription>
                  Top performers for the current month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Issues</TableHead>
                      <TableHead className="text-right">PRs</TableHead>
                      <TableHead className="text-right">Commits</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry) => (
                      <TableRow key={entry.userId}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={entry.avatarUrl || undefined} />
                              <AvatarFallback>
                                {entry.githubUsername.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {entry.githubUsername}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {entry.totalPoints.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.issuesClosed}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.prsMerged}/{entry.prsOpened}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.commitsPushed}
                        </TableCell>
                        <TableCell className="text-right">
                          {getChangeIndicator(entry.change)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Time Rankings</CardTitle>
                <CardDescription>
                  Hall of fame - top contributors of all time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Issues</TableHead>
                      <TableHead className="text-right">PRs</TableHead>
                      <TableHead className="text-right">Commits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry) => (
                      <TableRow key={entry.userId}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={entry.avatarUrl || undefined} />
                              <AvatarFallback>
                                {entry.githubUsername.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {entry.githubUsername}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {entry.totalPoints.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.issuesClosed}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.prsMerged}/{entry.prsOpened}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.commitsPushed}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
