'use client';

import { useState } from 'react';
import { GitHubRepository } from '@/@types/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SyncButton } from '@/components/github/sync-button';
import { GitFork, Star, RefreshCw, FolderGit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RepoListProps {
 repos: GitHubRepository[];
}

export function RepoList({ repos }: RepoListProps) {
 const [isSyncingAll, setIsSyncingAll] = useState(false);
 const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

 const handleSyncAll = async () => {
  setIsSyncingAll(true);
  setSyncProgress({ current: 0, total: repos.length });

  for (let i = 0; i < repos.length; i++) {
   const repo = repos[i];
   const [owner, repoName] = repo.fullName.split('/');

   try {
    await fetch('/api/sync/contributions', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
      owner,
      repo: repoName,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
     }),
    });
   } catch (error) {
    console.error(`Failed to sync ${repo.fullName}`, error);
   }

   setSyncProgress(prev => ({ ...prev, current: i + 1 }));
  }

  setIsSyncingAll(false);
 };

 if (repos.length === 0) {
  return null;
 }

 return (
  <Card className="bg-slate-900/50 border-sky-500/20">
   <CardHeader className="flex flex-row items-center justify-between">
    <div>
     <CardTitle className="text-slate-100">Repositories</CardTitle>
     <CardDescription className="text-slate-400">
      Sync contributions from your repositories
     </CardDescription>
    </div>
    <Button
     onClick={handleSyncAll}
     disabled={isSyncingAll}
     variant="outline"
     className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10"
    >
     <RefreshCw className={`mr-2 h-4 w-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
     {isSyncingAll ? `Syncing (${syncProgress.current}/${syncProgress.total})` : 'Sync All'}
    </Button>
   </CardHeader>
   <CardContent>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     {repos.map((repo) => {
      const [owner, repoName] = repo.fullName.split('/');
      return (
       <Card key={repo.id} className="bg-slate-800/30 border-slate-700/50 hover:border-sky-500/30 transition-colors">
        <CardContent className="p-4 space-y-3">
         <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
           <FolderGit2 className="h-5 w-5 text-slate-400" />
           <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-200 hover:text-sky-400 truncate max-w-[180px]"
           >
            {repo.name}
           </a>
          </div>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
           {repo.private ? 'Private' : 'Public'}
          </Badge>
         </div>

         <p className="text-xs text-slate-400 line-clamp-2 h-8">
          {repo.description || 'No description'}
         </p>

         <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-slate-500">
           <span className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {repo.stargazersCount}
           </span>
           <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" /> {repo.forksCount}
           </span>
           {repo.language && (
            <span className="flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-sky-500/50" />
             {repo.language}
            </span>
           )}
          </div>
          <SyncButton owner={owner} repo={repoName} />
         </div>
        </CardContent>
       </Card>
      );
     })}
    </div>
   </CardContent>
  </Card>
 );
}
