'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SyncButtonProps {
  owner: string;
  repo: string;
  className?: string;
}

export function SyncButton({ owner, repo, className }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');

    try {
      const response = await fetch('/api/sync/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✓ Synced ${data.data.pullRequests + data.data.issues + data.data.commits} contributions`);
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (error) {
      setMessage('✗ Failed to sync contributions');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleSync}
        disabled={syncing}
        className="bg-sky-500 hover:bg-sky-600"
        size="sm"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Syncing...' : 'Sync Contributions'}
      </Button>
      {message && (
        <p className={`text-xs mt-2 ${message.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
