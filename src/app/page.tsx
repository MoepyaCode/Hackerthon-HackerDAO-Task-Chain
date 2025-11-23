import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Coins, Award, GitBranch, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: GitBranch,
      title: 'GitHub Integration',
      description: 'Seamlessly connect your GitHub repositories and track contributions in real-time.',
    },
    {
      icon: Trophy,
      title: 'Leaderboard Rankings',
      description: 'Compete with your team on weekly and monthly leaderboards based on contributions.',
    },
    {
      icon: Coins,
      title: 'Crypto Rewards',
      description: 'Earn crypto payouts on the Celo network for top performance and milestones.',
    },
    {
      icon: Award,
      title: 'NFT Badges',
      description: 'Collect unique NFT badges for achieving milestones and accomplishments.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your contribution history, performance trends, and reward totals.',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All contributions and rewards are transparently logged on the blockchain.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              <span className="mr-2">🚀</span>
              Built on Celo Network
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Gamify Developer Productivity with{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Blockchain Rewards
              </span>
            </h1>

            <p className="text-base text-muted-foreground">
              TaskChain integrates with GitHub to track contributions, rank developers on leaderboards, 
              and distribute crypto rewards and NFT badges for milestones.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <Link href="/sign-up" className="w-full">
                <Button size="lg" className="w-full">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/leaderboard" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  View Leaderboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span>GitHub Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <span>Crypto Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>NFT Badges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl font-bold">
              Everything You Need to Motivate Your Team
            </h2>
            <p className="text-sm text-muted-foreground">
              TaskChain provides all the tools to gamify productivity and reward contributors fairly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10">
            <CardHeader className="text-center space-y-3 pb-6">
              <CardTitle className="text-2xl font-bold">
                Ready to Start Earning?
              </CardTitle>
              <CardDescription className="text-sm">
                Join TaskChain today and start earning crypto rewards for your contributions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/sign-up" className="w-full">
                <Button size="lg" className="w-full">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/sign-in" className="w-full">
                <Button size="lg" variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
