import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header, BottomNav } from '@/components/layout';
import { getUserRepositories } from '@/services/github-repo.service';
import { RepoList } from '@/components/dashboard/repo-list';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GitHubRepository } from '@/@types/github';

export default async function ReposSettingsPage({
 searchParams,
}: {
 searchParams: Promise<{ page?: string }>;
}) {
 const { userId } = await auth();
 if (!userId) redirect('/sign-in');

 const params = await searchParams;
 const page = Number(params.page) || 1;
 const perPage = 9;

 let repos: GitHubRepository[] = [];
 let hasMore = false;

 try {
  repos = await getUserRepositories(page, perPage);
  hasMore = repos.length === perPage;
 } catch (error) {
  console.error('Error fetching repos:', error);
 }

 return (
  <div className="flex flex-col min-h-screen bg-slate-950">
   <Header />
   <main className="flex-1 p-4 space-y-4 pb-20">
    <div className="space-y-1">
     <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">
      Repository Settings
     </h1>
     <p className="text-sm text-slate-400">
      Manage and sync your GitHub repositories
     </p>
    </div>

    <RepoList repos={repos} />

    <div className="flex items-center justify-center gap-4 mt-6">
     <Link href={`/dashboard/settings/repos?page=${page - 1}`} passHref legacyBehavior>
      <Button
       variant="outline"
       disabled={page <= 1}
       className="border-slate-700 text-slate-300 hover:bg-slate-800"
      >
       <ChevronLeft className="h-4 w-4 mr-2" />
       Previous
      </Button>
     </Link>
     <span className="text-slate-400 text-sm">Page {page}</span>
     <Link href={`/dashboard/settings/repos?page=${page + 1}`} passHref legacyBehavior>
      <Button
       variant="outline"
       disabled={!hasMore}
       className="border-slate-700 text-slate-300 hover:bg-slate-800"
      >
       Next
       <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
     </Link>
    </div>
   </main>
   <BottomNav />
  </div>
 );
}
