'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { User } from '@/@types';
import { UserService } from '@/services';

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!clerkUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserService.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkUser, isLoaded]);

  return { user, loading, error, isLoaded };
}
