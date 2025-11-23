import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Coins, Award, GitBranch, TrendingUp, Shield } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faBolt, faBullseye, faMedal, faGem, faGamepad, faRocket } from '@fortawesome/free-solid-svg-icons';

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
      <section className="relative flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-sky-950/30 to-slate-950 animate-gradient-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full max-w-md">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Animated Badge Icon */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-sky-500/30 animate-pulse" />
              <div className="relative text-8xl animate-bounce text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div className="absolute -top-2 -right-2 text-3xl text-yellow-400 animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <FontAwesomeIcon icon={faBolt} />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              <span className="text-slate-100">Code.</span>{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                Compete.
              </span>{' '}
              <span className="text-slate-100">Earn.</span>
            </h1>

            <p className="text-lg font-medium text-muted-foreground">
              Turn your GitHub commits into crypto rewards 💰
            </p>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 w-full py-4">
              <div className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/5 backdrop-blur-sm border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-2xl mb-2 text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                  <FontAwesomeIcon icon={faBullseye} />
                </div>
                <div className="text-xs font-medium text-slate-300">Track</div>
              </div>
              <div className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/5 backdrop-blur-sm border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-2xl mb-2 text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                  <FontAwesomeIcon icon={faMedal} />
                </div>
                <div className="text-xs font-medium text-slate-300">Compete</div>
              </div>
              <div className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/5 backdrop-blur-sm border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-2xl mb-2 text-sky-400 group-hover:text-sky-300 transition-colors drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                  <FontAwesomeIcon icon={faGem} />
                </div>
                <div className="text-xs font-medium text-slate-300">Earn</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Link href="/sign-up" className="w-full">
                <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
                  Start Earning Now <FontAwesomeIcon icon={faRocket} className="ml-2" />
                </Button>
              </Link>
              <Link href="/leaderboard" className="w-full">
                <Button size="lg" variant="outline" className="w-full border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400">
                  View Leaderboard
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Powered by Celo • Free to join
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-l-4 border-l-sky-500 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:bg-slate-900/80 hover:border-sky-400 transition-all duration-300 group">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30 shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-400/50 transition-all duration-300">
                        <Icon className="h-5 w-5 text-sky-400 group-hover:text-sky-300 transition-colors" />
                      </div>
                      <div>
                        <CardTitle className="text-base mb-1 text-slate-100">{feature.title}</CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-cyan-500/20 border-sky-500/50 border-2 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent animate-shimmer" />
            <CardContent className="relative pt-6">
              <div className="text-center space-y-6">
                <div className="text-6xl text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] animate-pulse">
                  <FontAwesomeIcon icon={faGamepad} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold mb-2 text-slate-100">
                    Level Up Your Code Game
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-300">
                    Join now and start earning rewards
                  </CardDescription>
                </div>
                <Link href="/sign-up" className="w-full block">
                  <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
                    Start Playing <FontAwesomeIcon icon={faBullseye} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
