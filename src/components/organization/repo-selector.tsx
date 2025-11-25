'use client';

import { useState } from 'react';
import { GitHubRepository } from '@/@types/github';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RepoSelectorProps {
  repos: GitHubRepository[];
  selectedRepos?: number[];
  onSelectionChange?: (repoIds: number[]) => void;
}

export function RepoSelector({ repos, selectedRepos = [], onSelectionChange }: RepoSelectorProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set(selectedRepos));

  const toggleRepo = (repoId: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(repoId)) {
      newSelected.delete(repoId);
    } else {
      newSelected.add(repoId);
    }
    setSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  return (
    <div className="space-y-4">
      {repos.map((repo) => {
        const isSelected = selected.has(repo.id);
        return (
          <Card
            key={repo.id}
            className={`p-4 transition-all duration-300 ${
              isSelected
                ? 'bg-sky-500/10 border-sky-500/50'
                : 'bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-100">{repo.name}</h3>
                  {repo.private && (
                    <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Private
                    </Badge>
                  )}
                </div>
                {repo.description && (
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{repo.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {repo.language && (
                    <Badge variant="outline" className="text-xs bg-slate-800/50 text-sky-400 border-sky-500/30">
                      {repo.language}
                    </Badge>
                  )}
                  {repo.stargazersCount !== undefined && repo.stargazersCount > 0 && (
                    <Badge variant="outline" className="text-xs bg-slate-800/50 text-slate-300 border-slate-600">
                      ⭐ {repo.stargazersCount}
                    </Badge>
                  )}
                  {repo.forksCount !== undefined && repo.forksCount > 0 && (
                    <Badge variant="outline" className="text-xs bg-slate-800/50 text-slate-300 border-slate-600">
                      🍴 {repo.forksCount}
                    </Badge>
                  )}
                  {repo.openIssuesCount !== undefined && repo.openIssuesCount > 0 && (
                    <Badge variant="outline" className="text-xs bg-slate-800/50 text-slate-300 border-slate-600">
                      📝 {repo.openIssuesCount} issues
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={() => toggleRepo(repo.id)}
                size="sm"
                className={`flex-shrink-0 ${
                  isSelected
                    ? 'bg-sky-500 hover:bg-sky-600'
                    : 'bg-slate-800 hover:bg-slate-700 border border-sky-500/30'
                }`}
              >
                {isSelected ? 'Tracking' : 'Track'}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
