'use client';

import { useState } from 'react';
import { Header, BottomNav } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
  Wallet,
  Coins,
  Award,
  TrendingUp,
  ExternalLink,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faRocket, faFire, faCertificate } from '@fortawesome/free-solid-svg-icons';export default function WalletPage() {
    const [copied, setCopied] = useState(false);

    // Mock data - will be replaced with real data from API
    const walletData = {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        balance: '125.50',
        totalEarned: '325.75',
        pendingRewards: '45.25',
    };

    const transactions = [
        {
            id: '1',
            type: 'REWARD',
            amount: '50.00',
            currency: 'CELO',
            status: 'COMPLETED',
            txHash: '0xabc123...def456',
            date: '2024-11-20',
            description: 'Weekly reward - Week 47',
        },
        {
            id: '2',
            type: 'REWARD',
            amount: '35.25',
            currency: 'CELO',
            status: 'COMPLETED',
            txHash: '0x789xyz...456abc',
            date: '2024-11-13',
            description: 'Weekly reward - Week 46',
        },
        {
            id: '3',
            type: 'REWARD',
            amount: '45.25',
            currency: 'CELO',
            status: 'PROCESSING',
            txHash: null,
            date: '2024-11-23',
            description: 'Weekly reward - Week 48',
        },
    ];

    const badges = [
        {
            id: '1',
            name: 'First Contribution',
            description: 'Made your first contribution',
            imageUrl: faBullseye,
            earnedAt: '2024-11-01',
            isMinted: true,
            nftTokenId: '42',
        },
        {
            id: '2',
            name: '10 PRs Merged',
            description: 'Successfully merged 10 pull requests',
            imageUrl: faRocket,
            earnedAt: '2024-11-10',
            isMinted: true,
            nftTokenId: '87',
        },
        {
            id: '3',
            name: '100 Points',
            description: 'Earned 100 total points',
            imageUrl: faFire,
            earnedAt: '2024-11-15',
            isMinted: false,
            nftTokenId: null,
        },
    ];

    const copyAddress = () => {
        navigator.clipboard.writeText(walletData.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
            case 'PROCESSING':
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Processing</Badge>;
            case 'FAILED':
                return <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border-rose-500/30">Failed</Badge>;
            default:
                return <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            <Header />
            <main className="flex-1 p-4 space-y-4 pb-20">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">Wallet</h1>
                    <p className="text-sm text-slate-400">
                        Manage your rewards and NFT badges
                    </p>
                </div>

                {/* Wallet Overview Card */}
                <Card className="border-2 border-sky-500/30 bg-slate-900/50 backdrop-blur-sm shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-100">
                            <Wallet className="h-5 w-5 text-sky-400" />
                            Wallet Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative flex items-center justify-between p-4 bg-slate-800/50 border border-sky-500/20 rounded-lg">
                            <div className='w-full'>
                                <div className='flex justify-between items-center'>
                                    <p className="text-sm text-slate-400 mb-1">Wallet Address</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyAddress}
                                        className="shrink-0 hover:bg-sky-500/10 hover:text-sky-400"
                                    >
                                        {copied ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <code className="text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap block text-sky-400">{walletData.address}</code>
                            </div>

                        </div>

                        <div className="grid gap-3 grid-cols-1">
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/30 border border-sky-500/10">
                                <p className="text-sm text-slate-400">Current Balance</p>
                                <p className="text-2xl font-bold text-sky-400">{walletData.balance} CELO</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/30 border border-sky-500/10">
                                <p className="text-sm text-slate-400">Total Earned</p>
                                <p className="text-2xl font-bold text-slate-100">{walletData.totalEarned} CELO</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/30 border border-sky-500/10">
                                <p className="text-sm text-slate-400">Pending Rewards</p>
                                <p className="text-2xl font-bold text-yellow-400">{walletData.pendingRewards} CELO</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-3 grid-cols-1">
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">
                                Total Rewards
                            </CardTitle>
                            <Coins className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-sky-400">
                                {walletData.totalEarned} CELO
                            </div>
                            <p className="text-xs text-slate-400">
                                All time earnings
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">NFT Badges</CardTitle>
                            <Award className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-100">{badges.length}</div>
                            <p className="text-xs text-slate-400">
                                {badges.filter((b) => b.isMinted).length} minted
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">
                                Average Weekly
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-100">42.5 CELO</div>
                            <p className="text-xs text-slate-400">
                                Last 4 weeks
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="transactions" className="space-y-4">
                    <TabsList className="bg-slate-900/50 border border-sky-500/20">
                        <TabsTrigger value="transactions" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">Transactions</TabsTrigger>
                        <TabsTrigger value="badges" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">NFT Badges</TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions" className="space-y-4">
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
                            <CardHeader>
                                <CardTitle className="text-slate-100">Transaction History</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Your reward payouts and transaction history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-sky-500/20 hover:bg-sky-500/5">
                                            <TableHead className="text-slate-300">Description</TableHead>
                                            <TableHead className="text-slate-300">Date</TableHead>
                                            <TableHead className="text-right text-slate-300">Amount</TableHead>
                                            <TableHead className="text-slate-300">Status</TableHead>
                                            <TableHead className="text-slate-300">Transaction</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx) => (
                                            <TableRow key={tx.id} className="border-sky-500/10 hover:bg-sky-500/5 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Coins className="h-4 w-4 text-sky-400" />
                                                        <span className="text-slate-200">{tx.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-300">{tx.date}</TableCell>
                                                <TableCell className="text-right font-bold text-sky-400">
                                                    {tx.amount} {tx.currency}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                                                <TableCell>
                                                    {tx.txHash ? (
                                                        <a
                                                            href={`https://explorer.celo.org/tx/${tx.txHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline"
                                                        >
                                                            <span className="font-mono text-sm">
                                                                {tx.txHash.slice(0, 8)}...
                                                            </span>
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-slate-500">—</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-4">
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-sky-500/20">
                            <CardHeader>
                                <CardTitle className="text-slate-100">Your NFT Badges</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Badges earned for milestones and achievements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 grid-cols-1">
                                    {badges.map((badge) => (
                                        <Card key={badge.id} className="border-2 border-sky-500/30 bg-slate-800/50 hover:bg-slate-800/70 hover:border-sky-400/50 transition-all duration-300 group">
                                            <CardHeader className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-5xl text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                                                        <FontAwesomeIcon icon={badge.imageUrl} />
                                                    </div>
                                                    {badge.isMinted ? (
                                                        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                            Minted
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50">Not Minted</Badge>
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base text-slate-100">{badge.name}</CardTitle>
                                                    <CardDescription className="text-sm mt-1 text-slate-400">
                                                        {badge.description}
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="text-xs text-slate-400">
                                                    Earned: {badge.earnedAt}
                                                </div>
                                                {badge.isMinted && badge.nftTokenId && (
                                                    <div className="text-xs text-sky-400">
                                                        Token ID: #{badge.nftTokenId}
                                                    </div>
                                                )}
                                                {!badge.isMinted && (
                                                    <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300">
                                                        Mint NFT
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
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
