'use client';

import { Header, BottomNav } from '@/components/layout';
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

export default function LeaderboardPage() {

  // Mock data - will be replaced with real data from API
  const leaderboardData = [
    {
      rank: 1,
      userId: '1',
      githubUsername: 'alice_dev',
      avatarUrl: null,
      totalPoints: 2450,
      issuesClosed: 78,
      prsOpened: 45,
      prsMerged: 42,
      commitsPushed: 320,
      change: 2, // Moved up 2 positions
    },
    {
      rank: 2,
      userId: '2',
      githubUsername: 'bob_coder',
      avatarUrl: null,
      totalPoints: 2180,
      issuesClosed: 65,
      prsOpened: 38,
      prsMerged: 35,
      commitsPushed: 290,
      change: -1, // Moved down 1 position
    },
    {
      rank: 3,
      userId: '3',
      githubUsername: 'charlie_eng',
      avatarUrl: null,
      totalPoints: 1890,
      issuesClosed: 52,
      prsOpened: 32,
      prsMerged: 30,
      commitsPushed: 245,
      change: 1,
    },
    {
      rank: 4,
      userId: '4',
      githubUsername: 'diana_tech',
      avatarUrl: null,
      totalPoints: 1750,
      issuesClosed: 48,
      prsOpened: 28,
      prsMerged: 26,
      commitsPushed: 220,
      change: -2,
    },
    {
      rank: 5,
      userId: '5',
      githubUsername: 'evan_code',
      avatarUrl: null,
      totalPoints: 1620,
      issuesClosed: 44,
      prsOpened: 25,
      prsMerged: 23,
      commitsPushed: 198,
      change: 0,
    },
  ];

  const stats = {
    totalContributors: 48,
    totalPoints: 28450,
    totalContributions: 2847,
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-500">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs">{change}</span>
        </div>
      );
    }
    return <span className="text-xs text-muted-foreground">—</span>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top contributors and their rankings
          </p>
        </div>

        {/* Stats Grid */}
          <div className="grid gap-3 grid-cols-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contributors
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContributors}</div>
                <p className="text-xs text-muted-foreground">
                  Active this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalPoints.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Earned this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contributions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalContributions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Rankings</CardTitle>
                  <CardDescription>
                    Top performers for the current week
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
