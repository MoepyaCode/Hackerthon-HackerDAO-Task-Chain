'use client';

import { GitHubOrganization } from '@/@types/github';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface GitHubOrgCardProps {
  org: GitHubOrganization;
  onSelect?: (org: GitHubOrganization) => void;
}

export function GitHubOrgCard({ org, onSelect }: GitHubOrgCardProps) {
  return (
    <Card className="p-4 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect?.(org)}
    >
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 ring-2 ring-sky-500/20 group-hover:ring-sky-500/40 transition-all">
          {org.avatarUrl && (
            <Image
              src={org.avatarUrl}
              alt={org.name || org.login}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
            {org.name}
          </h3>
          <p className="text-sm text-slate-400 mb-2">@{org.login}</p>
          {org.description && (
            <p className="text-sm text-slate-500 line-clamp-2">{org.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
