'use client';

import { useState, useEffect } from 'react';
import type { LeaderboardEntry, LeaderboardFilters } from '@/@types';
import { LeaderboardService } from '@/services';

export function useLeaderboard(filters: LeaderboardFilters) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const leaderboardData = await LeaderboardService.getLeaderboard(filters);
        setData(leaderboardData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filters.period, filters.organizationId, filters.repositoryId]);

  return { data, loading, error, refetch: () => {} };
}
