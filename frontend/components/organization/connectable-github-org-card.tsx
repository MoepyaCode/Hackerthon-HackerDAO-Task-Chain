'use client';

import { GitHubOrganization } from '@/@types/github';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { Loader2, Check, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConnectableGitHubOrgCardProps {
  org: GitHubOrganization;
  isConnected: boolean;
  clerkOrgSlug?: string;
}

export function ConnectableGitHubOrgCard({ org, isConnected, clerkOrgSlug }: ConnectableGitHubOrgCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch('/api/organizations/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubOrgLogin: org.login,
          githubOrgName: org.name || org.login,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If organizations feature is not enabled, redirect to re-authenticate with GitHub
        if (response.status === 403 && data.error?.includes('Organizations feature')) {
          setError('Organizations feature not enabled. Redirecting to reconnect GitHub...');
          setTimeout(() => {
            window.location.href = '/sign-in?redirect_url=/dashboard';
          }, 2000);
          return;
        }
        throw new Error(data.error || 'Failed to connect organization');
      }

      // Redirect to the newly connected organization
      router.push(`/organization/${data.organization.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsConnecting(false);
    }
  };

  const handleView = () => {
    if (clerkOrgSlug) {
      router.push(`/organization/${clerkOrgSlug}`);
    }
  };

  return (
    <Card className="p-4 bg-slate-900/50 border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 group flex flex-col gap-2 max-w-[25rem]">
      <div className="flex items-start gap-4 flex-1">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 ring-2 ring-sky-500/20 group-hover:ring-sky-500/40 transition-all">
          {org.avatarUrl && (
            <Image
              src={org.avatarUrl}
              alt={org.name || org.login}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 ">
          <div className="flex items-start justify-between gap-2 flex-col sm:flex-row">
            <div className="flex-1 min-w-0 text-nowrap">
              <h3 className="font-semibold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
                {org.name}
              </h3>
              <p className="text-sm text-slate-400 mb-2">@{org.login}</p>
            </div>
            {isConnected && (
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <Check className="h-4 w-4" />
                <span>Connected</span>
              </div>
            )}
          </div>
          {org.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{org.description}</p>
          )}
          {error && (
            <p className="text-xs text-rose-400 mb-2">{error}</p>
          )}
        </div>
      </div>
      {isConnected ? (
        <Button
          size="sm"
          variant="outline"
          onClick={handleView}
          className="w-full mt-4 border-sky-500/30 hover:bg-sky-500/10 hover:border-sky-500/50"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Organization
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.2)] hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Organization'
          )}
        </Button>
      )}
    </Card>
  );
}
